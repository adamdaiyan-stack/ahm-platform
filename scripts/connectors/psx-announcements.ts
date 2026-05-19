/**
 * scripts/connectors/psx-announcements.ts
 *
 * Data connector for PSX company announcements.
 *
 * ── What this does ──────────────────────────────────────────────────────────
 * Fetches the announcement section from each company's page on the PSX
 * Data Portal, parses the three HTML tables (Financial Results, Board
 * Meetings, Others), and returns normalized announcement records ready
 * for upsert into announcements_raw.
 *
 * ── Data source ─────────────────────────────────────────────────────────────
 * Per-symbol company page: https://dps.psx.com.pk/company/{SYMBOL}
 *
 * The Announcements section renders as three consecutive HTML tables:
 *   Table 1 — Financial Results
 *   Table 2 — Board Meetings
 *   Table 3 — Others
 * Each table has columns: Date | Title | Document (View + PDF link)
 *
 * The document ID in the PDF URL (e.g. /download/document/276542.pdf)
 * is the stable unique identifier for idempotent upserts.
 *
 * ── Rate limiting ───────────────────────────────────────────────────────────
 * This connector fetches one page per company. With 95 symbols and a
 * 500ms pause between requests, a full run takes ~50 seconds. Be a
 * good citizen — do not remove the delay.
 *
 * ── If parsing breaks ───────────────────────────────────────────────────────
 * 1. Visit https://dps.psx.com.pk/company/HBL in a browser
 * 2. Inspect the Announcements section HTML structure
 * 3. Update parseAnnouncementTables() to match the new structure
 * 4. The document_id extraction regex is the most fragile part
 *
 * ── Testing ─────────────────────────────────────────────────────────────────
 * Run with: npx tsx scripts/connectors/psx-announcements.ts [SYMBOL]
 * Example:  npx tsx scripts/connectors/psx-announcements.ts HBL
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RawAnnouncement {
  symbol:            string;
  document_id:       string;    // e.g. "276542"
  document_url:      string;    // full PDF URL
  announcement_date: string;    // ISO date "YYYY-MM-DD"
  title:             string;
  raw_category:      "financial_results" | "board_meetings" | "others";
  source:            string;
}

export interface CompanyFetchResult {
  symbol:        string;
  announcements: RawAnnouncement[];
  fetchedAt:     string;
  error?:        string;        // Set if the fetch or parse failed
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL         = "https://dps.psx.com.pk";
const FETCH_TIMEOUT_MS = 30_000;
const REQUEST_DELAY_MS = 500;   // Pause between symbol fetches — be a good citizen

// Table order on the company page corresponds to these categories
const CATEGORY_ORDER: RawAnnouncement["raw_category"][] = [
  "financial_results",
  "board_meetings",
  "others",
];

// ─── HTTP fetch ───────────────────────────────────────────────────────────────

async function fetchCompanyPage(symbol: string): Promise<string> {
  const url = `${BASE_URL}/company/${encodeURIComponent(symbol)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":      "AHM-Platform-DataPipeline/1.0 (contact: admin@ahm.com)",
        "Accept":          "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control":   "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} from ${url}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Date parsing ─────────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04",
  may: "05", jun: "06", jul: "07", aug: "08",
  sep: "09", oct: "10", nov: "11", dec: "12",
};

/**
 * parsePSXDate: Converts PSX date strings to ISO format.
 * Handles: "May 4, 2026", "Apr 14, 2026", "Mar 5, 2026"
 */
function parsePSXDate(raw: string): string | null {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  // Pattern: "Month D, YYYY" or "Month DD, YYYY"
  const match = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (!match) return null;

  const month = MONTH_MAP[match[1].toLowerCase().slice(0, 3)];
  if (!month) return null;

  const day  = match[2].padStart(2, "0");
  const year = match[3];
  return `${year}-${month}-${day}`;
}

// ─── HTML parser ──────────────────────────────────────────────────────────────

/**
 * extractDocumentId: Pulls the numeric document ID from a PSX PDF URL.
 * URL formats:
 *   Absolute: https://dps.psx.com.pk/download/document/276542.pdf
 *   Relative: /download/document/276542.pdf
 * Handles both single- and double-quoted href attributes.
 * Returns { id: "276542", url: "https://..." } or null if not found.
 */
function extractDocumentId(cellHtml: string): { id: string; url: string } | null {
  // Match PDF download URLs — single or double quotes, relative or absolute
  const match = cellHtml.match(
    /href=["']([^"']*\/download\/document\/(\d+)\.pdf)["']/i
  );
  if (!match) return null;

  const rawUrl = match[1];
  const id     = match[2];
  // Ensure we always store an absolute URL
  const url = rawUrl.startsWith("http")
    ? rawUrl
    : `${BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;

  return { url, id };
}

/**
 * stripHtml: Removes HTML tags and decodes basic entities.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * isAnnouncementTable: Returns true if the table has a header row that looks
 * like the PSX announcements structure (Date + Title + Document columns).
 * This is more robust than anchoring on a section ID.
 */
function isAnnouncementTable(tableHtml: string): boolean {
  // Extract the first <tr> and check for expected column headers
  const firstRowMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
  if (!firstRowMatch) return false;

  const headerText = stripHtml(firstRowMatch[1]).toLowerCase();
  // Must contain "date" and either "title" or "document"
  return headerText.includes("date") && (
    headerText.includes("title") || headerText.includes("document")
  );
}

/**
 * parseAnnouncementTables: Extracts announcements from the company page HTML.
 *
 * Strategy:
 * 1. Extract ALL <table> blocks from the page
 * 2. Keep only those whose header row looks like an announcement table
 *    (has "Date" and "Title"/"Document" columns)
 * 3. Map the first three matching tables → Financial Results / Board Meetings / Others
 * 4. Parse <tr> rows: date (col 0), title (col 1), doc link (col 2)
 *
 * This approach survives layout changes in surrounding page structure and
 * doesn't depend on fragile id/class anchors.
 */
function parseAnnouncementTables(
  html: string,
  symbol: string
): RawAnnouncement[] {
  // Extract all <table> blocks from the page
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  const candidateTables: string[] = [];
  let tableMatch: RegExpExecArray | null;

  while ((tableMatch = tableRegex.exec(html)) !== null) {
    candidateTables.push(tableMatch[0]);
  }

  // Keep only tables that look like PSX announcement tables
  const announcementTables = candidateTables.filter(isAnnouncementTable);

  if (announcementTables.length === 0) {
    return [];
  }

  const announcements: RawAnnouncement[] = [];

  // Map up to 3 tables → Financial Results / Board Meetings / Others
  announcementTables.slice(0, 3).forEach((tableHtml, tableIndex) => {
    const category = CATEGORY_ORDER[tableIndex];
    if (!category) return;

    // Extract <tr> rows (skip header rows with <th>)
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch: RegExpExecArray | null;

    while ((trMatch = trRegex.exec(tableHtml)) !== null) {
      const rowHtml = trMatch[1];
      if (/<th/i.test(rowHtml)) continue; // Skip header rows

      // Extract <td> cells
      const cells: string[] = [];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch: RegExpExecArray | null;

      while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
        cells.push(tdMatch[1]);
      }

      if (cells.length < 2) continue;

      // Col 0: Date
      const rawDate = stripHtml(cells[0] ?? "");
      const isoDate = parsePSXDate(rawDate);
      if (!isoDate) continue;

      // Col 1: Title
      const title = stripHtml(cells[1] ?? "").trim();
      if (!title || title.toLowerCase() === "title") continue;

      // Col 2: Document links (extract PDF URL + document ID)
      const docCell = cells[2] ?? "";
      const docInfo = extractDocumentId(docCell);

      // Skip rows with no document ID — not a real announcement
      if (!docInfo) continue;

      announcements.push({
        symbol,
        document_id:       docInfo.id,
        document_url:      docInfo.url,
        announcement_date: isoDate,
        title,
        raw_category:      category,
        source:            "dps_psx",
      });
    }
  });

  return announcements;
}

// ─── Public interface ─────────────────────────────────────────────────────────

export class PSXAnnouncementsConnector {
  /**
   * Fetch announcements for a single symbol.
   * Returns a CompanyFetchResult — never throws.
   */
  static async fetchSymbol(symbol: string): Promise<CompanyFetchResult> {
    try {
      const html = await fetchCompanyPage(symbol);
      const announcements = parseAnnouncementTables(html, symbol);
      return {
        symbol,
        announcements,
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      return {
        symbol,
        announcements: [],
        fetchedAt: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * Fetch announcements for multiple symbols sequentially with rate limiting.
   * Yields progress via the optional onProgress callback.
   */
  static async fetchSymbols(
    symbols: string[],
    onProgress?: (symbol: string, index: number, total: number) => void
  ): Promise<CompanyFetchResult[]> {
    const results: CompanyFetchResult[] = [];

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      onProgress?.(symbol, i, symbols.length);

      const result = await PSXAnnouncementsConnector.fetchSymbol(symbol);
      results.push(result);

      // Rate limit: pause between requests
      if (i < symbols.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
      }
    }

    return results;
  }
}

// ─── Standalone debug mode ────────────────────────────────────────────────────

if (
  process.argv[1]?.endsWith("psx-announcements.ts") ||
  process.argv[1]?.endsWith("psx-announcements.js")
) {
  const symbol = process.argv[2]?.toUpperCase() ?? "HBL";
  console.log(`\n═══ PSX Announcements Debug — ${symbol} ═══\n`);

  // In debug mode, also print raw parse diagnostics if 0 rows returned
  const debugSymbol = symbol;

  PSXAnnouncementsConnector.fetchSymbol(debugSymbol).then(async (result) => {
    if (result.error) {
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }

    console.log(`Fetched ${result.announcements.length} announcements for ${debugSymbol}:\n`);

    if (result.announcements.length === 0) {
      // Re-fetch and dump diagnostics to help debug parsing failures
      console.log("⚠ Zero results — running diagnostics...\n");
      try {
        const html = await fetchCompanyPage(debugSymbol);
        console.log(`  HTML length: ${html.length} chars`);

        // Count all tables
        const allTables = html.match(/<table[\s\S]*?<\/table>/gi) ?? [];
        console.log(`  Total <table> elements: ${allTables.length}`);

        // Show first href containing "download/document"
        const docLinks = html.match(/href=["'][^"']*\/download\/document\/\d+\.pdf["']/gi) ?? [];
        console.log(`  PDF download href matches: ${docLinks.length}`);
        if (docLinks.length > 0) {
          console.log(`  First match: ${docLinks[0]}`);
        }

        // Show a 500-char snippet around the first occurrence of "download/document"
        const docIdx = html.indexOf("/download/document/");
        if (docIdx !== -1) {
          const snippet = html.slice(Math.max(0, docIdx - 200), docIdx + 300);
          console.log(`\n  HTML snippet around first PDF link:\n${"─".repeat(60)}`);
          console.log(snippet);
          console.log("─".repeat(60));
        } else {
          console.log("\n  No /download/document/ found in HTML at all.");
          // Print first 1000 chars to see what we got
          console.log(`\n  First 1000 chars of HTML:\n${"─".repeat(60)}`);
          console.log(html.slice(0, 1000));
          console.log("─".repeat(60));
        }
      } catch (e) {
        console.error("  Diagnostics fetch failed:", e);
      }
      return;
    }

    for (const ann of result.announcements) {
      console.log(
        `  [${ann.raw_category}] ${ann.announcement_date}  doc:${ann.document_id}`
      );
      console.log(`    ${ann.title}`);
    }
  }).catch(console.error);
}

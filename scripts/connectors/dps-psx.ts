/**
 * scripts/connectors/dps-psx.ts
 *
 * Data connector for the PSX Data Portal (dps.psx.com.pk).
 *
 * ── What this does ──────────────────────────────────────────────────────────
 * Fetches end-of-day market data from PSX's official data portal.
 * Returns normalized price records ready for upsert into daily_prices.
 *
 * ── Data source ─────────────────────────────────────────────────────────────
 * PSX publishes daily market statistics through their website.
 * Primary endpoint: https://dps.psx.com.pk/market-summary (HTML table)
 * Securities data:  https://dps.psx.com.pk/market-watch (symbol-level data)
 *
 * ── If parsing breaks ───────────────────────────────────────────────────────
 * PSX does not provide a documented public API. If this connector fails:
 *   1. Visit https://dps.psx.com.pk in a browser and inspect the page structure
 *   2. Look for the securities data table (symbol, LDCP, current, change, volume)
 *   3. Update the parseSecuritiesHTML() function to match the current HTML structure
 *   4. Check the PSX market summary page for index data
 *
 * The connector interface (DPSPSXConnector class) is stable — only the
 * internal parsing logic needs updating if the source changes.
 *
 * ── Testing ─────────────────────────────────────────────────────────────────
 * Run with: npx tsx scripts/connectors/dps-psx.ts
 * This will print sample records without writing to the database.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NormalizedPriceRecord {
  symbol:         string;
  market_date:    string;   // ISO date 'YYYY-MM-DD'
  open:           number | null;
  high:           number | null;
  low:            number | null;
  close:          number;
  change:         number | null;
  change_percent: number | null;
  volume:         number | null;
  source:         string;
}

export interface NormalizedIndexRecord {
  index_symbol:   string;
  market_date:    string;
  open:           number | null;
  high:           number | null;
  low:            number | null;
  close:          number;
  change:         number | null;
  change_percent: number | null;
  volume:         number | null;
  advances:       number | null;
  declines:       number | null;
  unchanged:      number | null;
  source:         string;
}

export interface FetchResult {
  prices:  NormalizedPriceRecord[];
  indices: NormalizedIndexRecord[];
  fetchedAt: string;
}

// ─── PSX Endpoint Configuration ───────────────────────────────────────────────

const BASE_URL = "https://dps.psx.com.pk";

/**
 * PSX data endpoints.
 * These serve the PSX website's own market data pages.
 * Update these paths if PSX restructures their portal.
 */
const ENDPOINTS = {
  /**
   * All securities summary — one row per listed company.
   * Contains: symbol, LDCP (last day closing price), open, high, low,
   *           current price, change, volume.
   * Format: HTML table (parse with regex/string methods — no DOM available in Node)
   */
  securities: `${BASE_URL}/market-watch`,

  /**
   * PSX indices page — all index snapshots in a table.
   * Contains: KSE-100 (and other indices) with High, Low, Current, Change, % Change.
   *
   * NOTE: /market-summary returns 404. The correct endpoint is /indices.
   * Table columns: [0] Index | [1] High | [2] Low | [3] Current | [4] Change | [5] % Change
   */
  indices: `${BASE_URL}/indices`,
} as const;

// ─── HTTP Fetch helpers ───────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 30_000;

async function fetchWithTimeout(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Identify ourselves clearly — be a good citizen
        "User-Agent":      "AHM-Platform-DataPipeline/1.0 (contact: admin@ahm.com)",
        "Accept":          "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        // Avoid cached responses during market hours
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

// ─── HTML Parsers ─────────────────────────────────────────────────────────────

/**
 * parseNumber: Cleans a raw string from HTML into a float.
 * Handles: commas (1,234.56), parentheses for negatives (1.23), dashes for null.
 */
function parseNumber(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/,/g, "").replace(/\s/g, "");
  if (cleaned === "-" || cleaned === "" || cleaned === "N/A") return null;
  // Parentheses indicate negative: (1.23) → -1.23
  if (cleaned.startsWith("(") && cleaned.endsWith(")")) {
    return -parseFloat(cleaned.slice(1, -1));
  }
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/**
 * extractTableRows: Extracts <tr> contents from an HTML string.
 * Returns an array of arrays, where each inner array is the <td> text values.
 *
 * PSX tables typically follow this structure:
 *   <table>
 *     <thead><tr><th>Symbol</th><th>LDCP</th>...</th></thead>
 *     <tbody>
 *       <tr><td>HBL</td><td>162.50</td>...</td></tr>
 *       ...
 *     </tbody>
 *   </table>
 */
function extractTableRows(html: string, tableSelector?: string): string[][] {
  // Find the relevant table section
  let tableHtml = html;

  // If a selector hint is provided, narrow to that section
  if (tableSelector) {
    const startIdx = html.indexOf(tableSelector);
    if (startIdx !== -1) {
      tableHtml = html.slice(startIdx);
    }
  }

  const rows: string[][] = [];

  // Extract all <tr> blocks
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    const rowHtml = trMatch[1];

    // Skip header rows (contain <th> tags)
    if (/<th/i.test(rowHtml)) continue;

    // Extract <td> text content
    const cells: string[] = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;

    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      // Strip nested HTML tags, decode basic entities
      const text = tdMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
        .trim();
      cells.push(text);
    }

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows;
}

/**
 * parseSecuritiesHTML: Parses the PSX securities page HTML into price records.
 *
 * Expected table columns (PSX standard format):
 *   [0] SYMBOL
 *   [1] SECTOR
 *   [2] LISTED IN
 *   [3] LDCP         (Last Day Closing Price)
 *   [4] OPEN
 *   [5] HIGH
 *   [6] LOW
 *   [7] CURRENT      (Today's last traded price)
 *   [8] CHANGE
 *   [9] CHANGE (%)
 *   [10] VOLUME
 *
 * ⚠️  Column indices may shift if PSX adds or removes columns.
 *     Run the connector in standalone mode (npm run debug:connector) to
 *     print the first 3 rows and verify column mapping.
 */
function parseSecuritiesHTML(
  html: string,
  marketDate: string
): NormalizedPriceRecord[] {
  const rows = extractTableRows(html, "LDCP");

  if (rows.length === 0) {
    throw new Error(
      "No data rows found in PSX securities page. " +
      "The page structure may have changed — check https://dps.psx.com.pk/market-watch"
    );
  }

  const records: NormalizedPriceRecord[] = [];

  for (const cells of rows) {
    // Skip rows that don't have enough columns
    if (cells.length < 8) continue;

    const symbol = cells[0]?.trim().toUpperCase();
    if (!symbol || symbol.length === 0) continue;

    // LDCP is the "last day close price" — if today's current is available, use it
    const ldcp    = parseNumber(cells[3]);
    const open    = parseNumber(cells[4]);
    const high    = parseNumber(cells[5]);
    const low     = parseNumber(cells[6]);
    const current = parseNumber(cells[7]);
    const change  = parseNumber(cells[8]);
    const changePct = parseNumber(cells[9]);
    const volume  = parseNumber(cells[10]);

    // Use current price if available, else fall back to LDCP
    const close = current ?? ldcp;
    if (close == null || close <= 0) continue;

    records.push({
      symbol,
      market_date:    marketDate,
      open:           open,
      high:           high,
      low:            low,
      close,
      change:         change,
      change_percent: changePct,
      volume:         volume != null ? Math.round(volume) : null,
      source:         "dps_psx",
    });
  }

  return records;
}

/**
 * parseIndicesHTML: Parses the PSX /indices page into index records.
 *
 * Page URL: https://dps.psx.com.pk/indices
 * Table columns (confirmed May 2026):
 *   [0] Index name (e.g. "KSE100")
 *   [1] High
 *   [2] Low
 *   [3] Current  (today's close)
 *   [4] Change
 *   [5] % Change
 *
 * The page also shows a timestamp: "As of May 8, 2026 4:50 PM"
 * We use the caller-supplied marketDate rather than parsing this timestamp.
 *
 * Index name mapping (PSX label → our canonical index_name):
 *   KSE100 → KSE-100
 *   KSE30  → KSE-30
 */
const INDEX_NAME_MAP: Record<string, string> = {
  KSE100: "KSE-100",
  KSE30:  "KSE-30",
  KMIALLSHR: "KMI-All-Share",
  KMI30:  "KMI-30",
};

function parseIndicesHTML(
  html: string,
  marketDate: string
): NormalizedIndexRecord[] {
  const rows = extractTableRows(html, "KSE");

  if (rows.length === 0) {
    console.warn(
      "[dps-psx] No index rows found on /indices page. " +
      "PSX may have changed the page structure."
    );
    return [];
  }

  const records: NormalizedIndexRecord[] = [];

  for (const cells of rows) {
    if (cells.length < 4) continue;

    const rawName = cells[0]?.trim().toUpperCase().replace(/\s+/g, "");
    if (!rawName) continue;

    // Map PSX label to our canonical name; keep raw name if not in map
    const indexName = INDEX_NAME_MAP[rawName] ?? rawName;

    const high      = parseNumber(cells[1]);
    const low       = parseNumber(cells[2]);
    const close     = parseNumber(cells[3]);
    const change    = parseNumber(cells[4]);
    const changePct = parseNumber(cells[5]);

    if (close == null || close <= 0) continue;

    records.push({
      index_symbol:   indexName,
      market_date:    marketDate,
      open:           null,        // /indices page does not expose open
      high,
      low,
      close,
      change,
      change_percent: changePct,
      volume:         null,        // volume not on this page; computed separately
      advances:       null,        // computed by compute_market_breadth() SQL function
      declines:       null,
      unchanged:      null,
      source:         "dps_psx",
    });
  }

  return records;
}

// ─── Main Connector Class ─────────────────────────────────────────────────────

export class DPSPSXConnector {
  /**
   * Fetches all available market data for the given trading date.
   * Makes two requests: securities (stock prices) + market summary (index).
   */
  static async fetch(marketDate: string): Promise<FetchResult> {
    console.log(`[dps-psx] Fetching data for ${marketDate}...`);

    const [securitiesHtml, indicesHtml] = await Promise.allSettled([
      fetchWithTimeout(ENDPOINTS.securities),
      fetchWithTimeout(ENDPOINTS.indices),
    ]);

    // Securities (required)
    if (securitiesHtml.status === "rejected") {
      throw new Error(
        `Failed to fetch PSX securities page: ${securitiesHtml.reason}`
      );
    }

    const prices = parseSecuritiesHTML(securitiesHtml.value, marketDate);
    console.log(`[dps-psx] Parsed ${prices.length} security records`);

    // Indices (non-blocking — log warning if unavailable)
    const indices: NormalizedIndexRecord[] = [];
    if (indicesHtml.status === "fulfilled") {
      const indexRecords = parseIndicesHTML(indicesHtml.value, marketDate);
      indices.push(...indexRecords);
      const kse100 = indexRecords.find((r) => r.index_symbol === "KSE-100");
      if (kse100) {
        console.log(`[dps-psx] Parsed KSE-100: ${kse100.close} (${kse100.change_percent?.toFixed(2) ?? "?"}%)`);
      }
      console.log(`[dps-psx] Parsed ${indexRecords.length} index record(s)`);
    } else {
      console.warn(`[dps-psx] Indices page unavailable: ${indicesHtml.reason}`);
    }

    return {
      prices,
      indices,
      fetchedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns the column mapping for debugging.
   * Run with: npx tsx scripts/connectors/dps-psx.ts
   */
  static async debug(marketDate: string): Promise<void> {
    console.log("═══ DPS PSX Connector Debug ═══\n");
    const html = await fetchWithTimeout(ENDPOINTS.securities);

    const rows = extractTableRows(html, "LDCP");
    console.log(`Found ${rows.length} data rows.\n`);

    if (rows.length > 0) {
      console.log("First 3 rows (for column verification):");
      rows.slice(0, 3).forEach((cells, i) => {
        console.log(`\nRow ${i + 1}:`);
        cells.forEach((cell, j) => console.log(`  [${j}] ${cell}`));
      });
    }

    const result = await DPSPSXConnector.fetch(marketDate);
    console.log("\nSample parsed records:");
    result.prices.slice(0, 5).forEach((r) => console.log(JSON.stringify(r, null, 2)));
    if (result.indices.length > 0) {
      console.log("\nIndex record:");
      console.log(JSON.stringify(result.indices[0], null, 2));
    }
  }
}

// ─── Standalone mode ─────────────────────────────────────────────────────────
// Runs when called directly: npx tsx scripts/connectors/dps-psx.ts

if (process.argv[1]?.endsWith("dps-psx.ts") || process.argv[1]?.endsWith("dps-psx.js")) {
  const date = process.argv[2] ?? new Date().toISOString().slice(0, 10);
  DPSPSXConnector.debug(date).catch(console.error);
}

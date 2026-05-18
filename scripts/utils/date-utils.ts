/**
 * scripts/utils/date-utils.ts
 *
 * Date helpers for pipeline scripts.
 * All dates in this system are ISO strings ('YYYY-MM-DD') in Pakistan time.
 * Pakistan does not observe daylight saving time (UTC+5 year-round).
 */

const PKT_OFFSET_HOURS = 5;

/**
 * Returns today's date in Pakistan time as 'YYYY-MM-DD'.
 * Use this as the default run_date when no --date flag is passed.
 */
export function todayPKT(): string {
  const now = new Date();
  // Shift UTC to PKT
  const pkt = new Date(now.getTime() + PKT_OFFSET_HOURS * 60 * 60 * 1000);
  return pkt.toISOString().slice(0, 10);
}

/**
 * Parses a --date=YYYY-MM-DD CLI argument.
 * Returns the parsed date or falls back to todayPKT().
 */
export function parseDateArg(args: string[]): string {
  const dateArg = args.find((a) => a.startsWith("--date="));
  if (dateArg) {
    const value = dateArg.replace("--date=", "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(
        `Invalid --date format: "${value}". Expected YYYY-MM-DD (e.g. --date=2026-05-19)`
      );
    }
    return value;
  }
  return todayPKT();
}

/**
 * Returns true if the given ISO date string is a weekend (Saturday or Sunday).
 * Uses UTC day since we've already adjusted to PKT when forming the date.
 */
export function isWeekend(isoDate: string): boolean {
  const d = new Date(isoDate + "T00:00:00Z");
  const day = d.getUTCDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
}

/**
 * Returns the previous trading day (Mon–Fri) relative to a given date.
 * Does NOT account for PSX public holidays (a future enhancement).
 */
export function prevTradingDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  do {
    d.setUTCDate(d.getUTCDate() - 1);
  } while (isWeekend(d.toISOString().slice(0, 10)));
  return d.toISOString().slice(0, 10);
}

/**
 * Formats a Date as 'YYYY-MM-DD'.
 */
export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Returns the difference in milliseconds between two Date objects.
 */
export function durationMs(start: Date, end: Date): number {
  return end.getTime() - start.getTime();
}

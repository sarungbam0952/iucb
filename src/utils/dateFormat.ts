/**
 * IUCB Date & Time Formatting Utilities
 *
 * All user-facing dates must be displayed as DD/MM/YYYY.
 * User-facing date-time values must be displayed as DD/MM/YYYY hh:mm AM/PM.
 * Internal storage format remains YYYY-MM-DD — only the display is changed here.
 */

/**
 * Converts a date string (YYYY-MM-DD), Date object, or timestamp to DD/MM/YYYY display format.
 * Returns '—' for empty/null/invalid values.
 *
 * Example:
 *   formatDate("2026-09-22") => "22/09/2026"
 *   formatDate("1998-01-20") => "20/01/1998"
 */
export function formatDate(date: string | Date | number | null | undefined): string {
  if (date === null || date === undefined || date === '') return '—';

  if (date instanceof Date) {
    if (isNaN(date.getTime())) return '—';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  if (typeof date === 'number') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return formatDate(d);
  }

  const str = String(date).trim();
  if (!str) return '—';

  // Match YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm:ss
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  // Match YYYY/MM/DD
  const slashMatch = str.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  if (slashMatch) {
    return `${slashMatch[3]}/${slashMatch[2]}/${slashMatch[1]}`;
  }

  // Already in DD/MM/YYYY — return as-is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }

  // Fallback: attempt Date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const dd = String(parsed.getDate()).padStart(2, '0');
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const yyyy = parsed.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  return str;
}

/**
 * Converts a date/time string, Date object, or timestamp to DD/MM/YYYY hh:mm AM/PM display format.
 * Returns '—' for empty/null/invalid values.
 *
 * Example:
 *   formatDateTime("2026-09-22 10:24 AM") => "22/09/2026 10:24 AM"
 *   formatDateTime("2026-09-20 04:15 PM") => "20/09/2026 04:15 PM"
 *   formatDateTime("2026-09-22T10:24:00") => "22/09/2026 10:24 AM"
 */
export function formatDateTime(date: string | Date | number | null | undefined): string {
  if (date === null || date === undefined || date === '') return '—';

  if (date instanceof Date) {
    if (isNaN(date.getTime())) return '—';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  if (typeof date === 'number') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return formatDateTime(d);
  }

  const str = String(date).trim();
  if (!str) return '—';

  // Relative times (e.g. "20 mins ago", "Yesterday", "1 hour ago") pass through
  if (/ago|yesterday|just now|today/i.test(str)) {
    return str;
  }

  // Pattern: "YYYY-MM-DD hh:mm AM/PM" or "YYYY-MM-DD HH:mm"
  const formattedMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (formattedMatch) {
    const yyyy = formattedMatch[1];
    const mm = formattedMatch[2];
    const dd = formattedMatch[3];
    let hour = parseInt(formattedMatch[4], 10);
    const minute = formattedMatch[5];
    let ampm = formattedMatch[7] ? formattedMatch[7].toUpperCase() : null;

    if (!ampm) {
      ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
    }

    return `${dd}/${mm}/${yyyy} ${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
  }

  // Pattern: "DD/MM/YYYY hh:mm AM/PM"
  const alreadyFormattedMatch = str.match(/^(\d{2})\/(\d{2})\/(\d{4})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (alreadyFormattedMatch) {
    const dd = alreadyFormattedMatch[1];
    const mm = alreadyFormattedMatch[2];
    const yyyy = alreadyFormattedMatch[3];
    let hour = parseInt(alreadyFormattedMatch[4], 10);
    const minute = alreadyFormattedMatch[5];
    let ampm = alreadyFormattedMatch[7] ? alreadyFormattedMatch[7].toUpperCase() : null;

    if (!ampm) {
      ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
    }

    return `${dd}/${mm}/${yyyy} ${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
  }

  // Fallback: parse as Date
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return formatDateTime(parsed);
  }

  return str;
}

/**
 * Converts a DD/MM/YYYY display string back to YYYY-MM-DD for use in
 * <input type="date"> value props (which require YYYY-MM-DD internally).
 * Pass-through if already in YYYY-MM-DD.
 */
export function toInputDateValue(display: string | null | undefined): string {
  if (!display) return '';

  // If already YYYY-MM-DD, return directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(display)) return display;

  // Convert DD/MM/YYYY → YYYY-MM-DD
  const parts = display.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  return display;
}

/**
 * Returns today's date as a YYYY-MM-DD string (for <input type="date"> default values).
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns today's date formatted as DD/MM/YYYY.
 */
export function todayDisplay(): string {
  return formatDate(todayISO());
}

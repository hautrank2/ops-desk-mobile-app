import { format, differenceInMinutes, differenceInHours, differenceInDays, isThisYear } from "date-fns";

/**
 * Smart date formatter:
 * - < 1 min  → "just now"
 * - < 1 hour → "X min ago"
 * - < 24h    → "X hr ago"
 * - < 7 days → "X days ago"
 * - same year → "d MMM"
 * - older    → "d MMM yyyy"
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";

  const now = new Date();
  const mins = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;
  if (isThisYear(date)) return format(date, "d MMM");
  return format(date, "d MMM yyyy");
}

/** Full datetime, always shown */
export function formatDateFull(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";
  return format(date, "HH:mm - dd/MM/yyyy");
}

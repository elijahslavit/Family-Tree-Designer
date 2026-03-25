import { compareAsc, format } from "date-fns";

export function formatLifespan(
  birth?: string | null,
  death?: string | null,
  isLiving?: boolean,
) {
  const left = birth ?? "Unknown";
  const right = isLiving ? "Living" : (death ?? "Unknown");
  return `${left} - ${right}`;
}

export function formatDisplayDate(dateText?: string | null, normalized?: string | null) {
  if (dateText) {
    return dateText;
  }

  if (normalized) {
    return format(new Date(normalized), "MMM d, yyyy");
  }

  return "Unknown";
}

export function compareNormalizedDates(
  left?: string | null,
  right?: string | null,
) {
  if (!left && !right) {
    return 0;
  }

  if (!left) {
    return 1;
  }

  if (!right) {
    return -1;
  }

  return compareAsc(new Date(left), new Date(right));
}

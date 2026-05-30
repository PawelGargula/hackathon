// Shared Polish-locale formatting helpers.

const dateTimeFmt = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFmt = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDateTime(date: Date): string {
  return dateTimeFmt.format(date);
}

export function formatTime(date: Date): string {
  return timeFmt.format(date);
}

export function formatDate(date: Date): string {
  return dateFmt.format(date);
}

export function formatPrice(price: number | null): string {
  if (price == null) return "bezplatnie";
  if (price === 0) return "bezplatnie";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 2,
  }).format(price);
}

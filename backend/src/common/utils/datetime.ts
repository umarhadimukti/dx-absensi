export const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

export function wibToday(): Date {
  const wib = new Date(Date.now() + WIB_OFFSET_MS);
  return new Date(Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate()));
}
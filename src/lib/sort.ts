// Order items by how close their date is to "now" (smallest absolute
// time difference first). Falls back to the year when no premiere date.
interface Datable {
  premiere?: string;
  year?: number | null;
}

function timeOf(item: Datable): number | null {
  if (item.premiere) {
    const t = new Date(item.premiere).getTime();
    if (!Number.isNaN(t)) return t;
  }
  if (item.year) return new Date(item.year, 6, 1).getTime(); // mid-year
  return null;
}

export function byProximity<T extends Datable>(items: T[]): T[] {
  const now = Date.now();
  return [...items].sort((a, b) => {
    const ta = timeOf(a);
    const tb = timeOf(b);
    if (ta === null && tb === null) return 0;
    if (ta === null) return 1;
    if (tb === null) return -1;
    return Math.abs(ta - now) - Math.abs(tb - now);
  });
}

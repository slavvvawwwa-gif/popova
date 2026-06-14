// Shared bento span pattern (12-column grid) used by the works catalog,
// the home "Featured" grid and the work-detail gallery. The 5-tile period
// tiles a 12×3 block exactly (one large landscape + a portrait + a row of
// three medium tiles), so with grid-auto-flow: dense there are no gaps.
export const BENTO_SPANS: { c: number; r: number }[] = [
  { c: 8, r: 2 },
  { c: 4, r: 2 },
  { c: 4, r: 1 },
  { c: 4, r: 1 },
  { c: 4, r: 1 },
];

export const spanFor = (i: number) => BENTO_SPANS[i % BENTO_SPANS.length];

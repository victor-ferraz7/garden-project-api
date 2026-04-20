/** Teto de itens por página em listagens (mitigação de abuso / DoS). */
const MAX_PAGE_SIZE = 100;

/**
 * @param {unknown} limit
 * @returns {number|undefined} inteiro positivo limitado a MAX_PAGE_SIZE, ou undefined
 */
function capPaginationLimit(limit: unknown): number | undefined {
  if (limit == null) return undefined;
  const n = parseInt(String(limit), 10);
  if (!Number.isInteger(n) || n <= 0) return undefined;
  return Math.min(n, MAX_PAGE_SIZE);
}

module.exports = { MAX_PAGE_SIZE, capPaginationLimit };

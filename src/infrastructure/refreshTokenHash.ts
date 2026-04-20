const crypto = require("crypto");

/**
 * Hash determinístico do JWT de refresh (evita limite de 72 bytes do bcrypt).
 * @param {string} plainRefreshToken
 * @returns {string} hex
 */
function hashRefreshToken(plainRefreshToken) {
  return crypto.createHash("sha256").update(plainRefreshToken, "utf8").digest("hex");
}

/**
 * Comparação em tempo constante.
 * @param {string} plainRefreshToken
 * @param {string} storedHex
 * @returns {boolean}
 */
function refreshTokenMatches(plainRefreshToken, storedHex) {
  try {
    const a = Buffer.from(hashRefreshToken(plainRefreshToken), "hex");
    const b = Buffer.from(storedHex, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

module.exports = { hashRefreshToken, refreshTokenMatches };

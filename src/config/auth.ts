/**
 * Configuração JWT e tempos de sessão (variáveis de ambiente).
 */
function getAccessSecret() {
  const s = process.env.JWT_ACCESS_SECRET;
  if (!s || s.length < 16) {
    throw new Error("JWT_ACCESS_SECRET deve estar definido e ter pelo menos 16 caracteres");
  }
  return s;
}

function getRefreshSecret() {
  const s = process.env.JWT_REFRESH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("JWT_REFRESH_SECRET deve estar definido e ter pelo menos 16 caracteres");
  }
  return s;
}

function getJwtIssuer() {
  return process.env.JWT_ISSUER || "gp-api";
}

function getJwtAudience() {
  return process.env.JWT_AUDIENCE || "gp-api-clients";
}

module.exports = {
  getAccessSecret,
  getRefreshSecret,
  getJwtIssuer,
  getJwtAudience,
  accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
};

/**
 * Variáveis mínimas antes de carregar módulos que leem JWT (casos de uso auth, jwt, etc.).
 */
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "test-jwt-access-secret-min-16-chars";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "test-jwt-refresh-secret-min-16-chars";
process.env.NODE_ENV = process.env.NODE_ENV || "test";

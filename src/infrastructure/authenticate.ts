const { verifyAccessToken } = require("./jwt");
const { UnauthorizedError } = require("../domain/errors");

/**
 * Middleware: valida Bearer access JWT e define req.auth = { sub }.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token ausente");
    }
    const token = header.slice(7).trim();
    if (!token) throw new UnauthorizedError("Token ausente");
    const { sub } = await verifyAccessToken(token);
    req.auth = { sub };
    next();
  } catch (err) {
    next(err instanceof UnauthorizedError ? err : new UnauthorizedError("Não autorizado"));
  }
}

module.exports = authenticate;

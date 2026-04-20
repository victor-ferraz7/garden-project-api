const { NotFoundError, ValidationError, UnauthorizedError } = require("../domain/errors");

/**
 * Middleware de erro global: traduz erros de domínio e Mongoose para HTTP.
 * Deve ser registrado após todas as rotas (quatro argumentos: err, req, res, next).
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function errorMiddleware(err: unknown, req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) {
  const statusCode = getStatusCode(err);
  const message = getMessage(err);
  const body: { error: string; details?: unknown } = { error: message };
  if (err && typeof err === "object" && "details" in err && (err as { details?: unknown }).details != null) {
    body.details = (err as { details: unknown }).details;
  }
  res.status(statusCode).json(body);
}

function getStatusCode(err: unknown) {
  if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode?: number }).statusCode != null) {
    return (err as { statusCode: number }).statusCode;
  }
  if (err instanceof NotFoundError) return 404;
  if (err instanceof UnauthorizedError) return 401;
  if (err instanceof ValidationError) return 400;
  if (err && typeof err === "object") {
    const o = err as { name?: string };
    if (o.name === "ValidationError") return 400;
    if (o.name === "CastError") return 404;
  }
  return 500;
}

function getMessage(err: unknown) {
  if (err instanceof NotFoundError || err instanceof ValidationError || err instanceof UnauthorizedError) {
    return (err as Error).message;
  }
  if (err && typeof err === "object" && "name" in err) {
    const e = err as { name?: string; message?: string };
    if (e.name === "ValidationError" && e.message) return e.message;
    if (e.name === "CastError") return "Recurso não encontrado";
  }
  if (process.env.NODE_ENV === "production" && getStatusCode(err) === 500) {
    return "Erro interno do servidor";
  }
  if (err && typeof err === "object" && "message" in err && typeof (err as Error).message === "string") {
    return (err as Error).message || "Erro interno do servidor";
  }
  return "Erro interno do servidor";
}

module.exports = errorMiddleware;

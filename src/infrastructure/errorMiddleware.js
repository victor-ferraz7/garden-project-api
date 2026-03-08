const { NotFoundError, ValidationError } = require("../domain/errors");

/**
 * Middleware de erro global: traduz erros de domínio e Mongoose para HTTP.
 * Deve ser registrado após todas as rotas (quatro argumentos: err, req, res, next).
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function errorMiddleware(err, req, res, next) {
  const statusCode = getStatusCode(err);
  const message = getMessage(err);
  const body = { error: message };
  if (err.details) body.details = err.details;
  res.status(statusCode).json(body);
}

function getStatusCode(err) {
  if (err.statusCode != null) return err.statusCode;
  if (err instanceof NotFoundError) return 404;
  if (err instanceof ValidationError) return 400;
  if (err.name === "ValidationError") return 400; // Mongoose
  if (err.name === "CastError") return 404;       // Mongoose ObjectId inválido
  return 500;
}

function getMessage(err) {
  if (err instanceof NotFoundError || err instanceof ValidationError) return err.message;
  if (err.name === "ValidationError") return err.message; // Mongoose
  if (err.name === "CastError") return "Recurso não encontrado";
  return err.message || "Erro interno do servidor";
}

module.exports = errorMiddleware;

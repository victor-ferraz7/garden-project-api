/**
 * Erros de domínio/aplicação para resposta HTTP padronizada.
 * O middleware de erro traduz esses tipos para status e JSON.
 */

class NotFoundError extends Error {
  statusCode: number;

  constructor(message = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

class ValidationError extends Error {
  statusCode: number;
  details: unknown;

  constructor(message = "Dados inválidos", details: unknown = null) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

class DomainError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 422) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainError);
    }
  }
}

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = "Não autorizado") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  DomainError,
  UnauthorizedError,
};

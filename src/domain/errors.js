/**
 * Erros de domínio/aplicação para resposta HTTP padronizada.
 * O middleware de erro traduz esses tipos para status e JSON.
 */

/**
 * Recurso não encontrado (404).
 */
class NotFoundError extends Error {
  constructor(message = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

/**
 * Dados inválidos (400). Ex.: validação de entrada ou de regra de negócio.
 */
class ValidationError extends Error {
  constructor(message = "Dados inválidos", details = null) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Erro genérico de domínio (pode ser mapeado para 422 ou 409 conforme uso).
 */
class DomainError extends Error {
  constructor(message, statusCode = 422) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainError);
    }
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  DomainError,
};

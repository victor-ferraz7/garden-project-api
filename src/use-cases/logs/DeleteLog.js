const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover um log.
 */
class DeleteLog {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ id: string }} input - id é o _id do MongoDB
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const deleted = await this.logRepository.delete(input.id);
    if (!deleted) throw new NotFoundError("Log não encontrado");
  }
}

module.exports = DeleteLog;

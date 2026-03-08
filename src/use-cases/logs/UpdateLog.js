const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: atualizar um log existente.
 */
class UpdateLog {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ id: string, update: Partial<import("../../../domain/log").Log> }} input
   * @returns {Promise<import("../../../domain/log").Log>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const log = await this.logRepository.update(input.id, input.update);
    if (!log) throw new NotFoundError("Log não encontrado");
    return log;
  }
}

module.exports = UpdateLog;

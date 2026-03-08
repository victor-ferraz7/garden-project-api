const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter um log pelo _id do MongoDB.
 */
class GetLogById {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ id: string }} input
   * @returns {Promise<import("../../../domain/log").Log>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const log = await this.logRepository.findByMongoId(input.id);
    if (!log) throw new NotFoundError("Log não encontrado");
    return log;
  }
}

module.exports = GetLogById;

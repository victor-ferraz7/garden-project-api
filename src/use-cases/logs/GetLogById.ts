const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter um log pelo _id do MongoDB.
 */
class GetLogById {
  declare logRepository: any;
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ id: string, actorId: string }} input
   */
  async execute(input) {
    const log = await this.logRepository.findByMongoId(input.id, input.actorId);
    if (!log) throw new NotFoundError("Log não encontrado");
    return log;
  }
}

module.exports = GetLogById;

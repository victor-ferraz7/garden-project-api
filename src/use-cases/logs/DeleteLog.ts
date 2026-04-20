const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover um log.
 */
class DeleteLog {
  declare logRepository: any;
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ id: string, actorId: string }} input - id é o _id do MongoDB
   */
  async execute(input) {
    const deleted = await this.logRepository.delete(input.id, input.actorId);
    if (!deleted) throw new NotFoundError("Log não encontrado");
  }
}

module.exports = DeleteLog;

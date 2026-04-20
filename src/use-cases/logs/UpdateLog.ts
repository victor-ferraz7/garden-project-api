const { NotFoundError } = require("../../domain/errors");

function stripImmutable(update) {
  if (!update || typeof update !== "object") return update;
  const { ownerId: _o, gardenId: _g, ...rest } = update;
  return rest;
}

/**
 * Caso de uso: atualizar um log existente.
 */
class UpdateLog {
  declare logRepository: any;
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ id: string, update: object, actorId: string }} input
   */
  async execute(input) {
    const log = await this.logRepository.update(
      input.id,
      stripImmutable(input.update),
      input.actorId
    );
    if (!log) throw new NotFoundError("Log não encontrado");
    return log;
  }
}

module.exports = UpdateLog;

const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: criar um novo log (gardenId deve pertencer ao actorId).
 */
class CreateLog {
  declare logRepository: any;
  declare gardenRepository: any;
  /**
   * @param {import("../../application/ports/logRepository")} logRepository
   * @param {import("../../application/ports/gardenRepository")} gardenRepository
   */
  constructor(logRepository, gardenRepository) {
    this.logRepository = logRepository;
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {object} input - campos do log + actorId
   */
  async execute(input) {
    const { actorId, ownerId: _o, ...logFields } = input;
    const garden = await this.gardenRepository.findById(logFields.gardenId, actorId);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return this.logRepository.create({ ...logFields, ownerId: actorId });
  }
}

module.exports = CreateLog;

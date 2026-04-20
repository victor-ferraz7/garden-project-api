const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter um jardim pelo id de negócio.
 */
class GetGardenById {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ id: string, actorId: string }} input
   * @throws {NotFoundError}
   */
  async execute(input) {
    const garden = await this.gardenRepository.findById(input.id, input.actorId);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return garden;
  }
}

module.exports = GetGardenById;

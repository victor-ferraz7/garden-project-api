const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: listar plantas de um jardim.
 */
class GetGardenPlants {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, actorId: string }} input
   */
  async execute(input) {
    const garden = await this.gardenRepository.findById(input.gardenId, input.actorId);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return garden.plants || [];
  }
}

module.exports = GetGardenPlants;

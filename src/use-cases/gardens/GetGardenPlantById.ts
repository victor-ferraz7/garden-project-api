const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter uma planta pelo id dentro do jardim.
 */
class GetGardenPlantById {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plantId: string, actorId: string }} input
   */
  async execute(input) {
    const garden = await this.gardenRepository.findById(input.gardenId, input.actorId);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    const plant = (garden.plants || []).find((p) => p.id === input.plantId);
    if (!plant) throw new NotFoundError("Planta não encontrada");
    return plant;
  }
}

module.exports = GetGardenPlantById;

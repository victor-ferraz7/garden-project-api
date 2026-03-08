const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter uma planta específica de um jardim.
 */
class GetGardenPlantById {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plantId: string }} input
   * @returns {Promise<import("../../../domain/garden").Plant>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const garden = await this.gardenRepository.findById(input.gardenId);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    const plant = (garden.plants || []).find((p) => p.id === input.plantId);
    if (!plant) throw new NotFoundError("Planta não encontrada");
    return plant;
  }
}

module.exports = GetGardenPlantById;

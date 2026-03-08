const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: adicionar uma planta a um jardim.
 */
class AddPlantToGarden {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plant: import("../../../domain/garden").Plant }} input
   * @returns {Promise<import("../../../domain/garden").Plant>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const added = await this.gardenRepository.addPlant(input.gardenId, input.plant);
    if (!added) throw new NotFoundError("Jardim não encontrado");
    return added;
  }
}

module.exports = AddPlantToGarden;

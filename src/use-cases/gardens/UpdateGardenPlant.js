const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: atualizar uma planta de um jardim.
 */
class UpdateGardenPlant {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plantId: string, update: Partial<import("../../../domain/garden").Plant> }} input
   * @returns {Promise<import("../../../domain/garden").Plant>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const plant = await this.gardenRepository.updatePlant(
      input.gardenId,
      input.plantId,
      input.update
    );
    if (!plant) throw new NotFoundError("Planta não encontrada");
    return plant;
  }
}

module.exports = UpdateGardenPlant;

const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover uma planta de um jardim.
 */
class DeleteGardenPlant {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plantId: string }} input
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const removed = await this.gardenRepository.deletePlant(input.gardenId, input.plantId);
    if (!removed) throw new NotFoundError("Planta não encontrada");
  }
}

module.exports = DeleteGardenPlant;

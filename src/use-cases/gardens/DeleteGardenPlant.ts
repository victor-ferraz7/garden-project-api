const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover uma planta de um jardim.
 */
class DeleteGardenPlant {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plantId: string, actorId: string }} input
   */
  async execute(input) {
    const removed = await this.gardenRepository.deletePlant(
      input.gardenId,
      input.plantId,
      input.actorId
    );
    if (!removed) throw new NotFoundError("Planta não encontrada");
  }
}

module.exports = DeleteGardenPlant;

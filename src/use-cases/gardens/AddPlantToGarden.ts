const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: adicionar uma planta a um jardim.
 */
class AddPlantToGarden {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plant: object, actorId: string }} input
   */
  async execute(input) {
    const added = await this.gardenRepository.addPlant(
      input.gardenId,
      input.plant,
      input.actorId
    );
    if (!added) throw new NotFoundError("Jardim não encontrado");
    return added;
  }
}

module.exports = AddPlantToGarden;

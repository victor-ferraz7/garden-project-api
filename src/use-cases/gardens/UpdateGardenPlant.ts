const { NotFoundError } = require("../../domain/errors");

function stripImmutable(update) {
  if (!update || typeof update !== "object") return update;
  const { ownerId: _o, id: _i, ...rest } = update;
  return rest;
}

/**
 * Caso de uso: atualizar uma planta de um jardim.
 */
class UpdateGardenPlant {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string, plantId: string, update: object, actorId: string }} input
   */
  async execute(input) {
    const plant = await this.gardenRepository.updatePlant(
      input.gardenId,
      input.plantId,
      stripImmutable(input.update),
      input.actorId
    );
    if (!plant) throw new NotFoundError("Planta não encontrada");
    return plant;
  }
}

module.exports = UpdateGardenPlant;

/**
 * Caso de uso: criar um novo jardim.
 */
class CreateGarden {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {import("../../../domain/garden").Garden} input
   * @returns {Promise<import("../../../domain/garden").Garden>}
   */
  async execute(input) {
    return this.gardenRepository.create(input);
  }
}

module.exports = CreateGarden;

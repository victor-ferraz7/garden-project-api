// Porta (interface) para acesso a Gardens na arquitetura limpa.
// Implementações concretas (ex.: via Mongoose) devem cumprir este contrato.

/**
 * @typedef {import("../../domain/garden").Garden} Garden
 */

class GardenRepository {
  /**
   * @param {{ phase?: string, environment?: string, limit?: number, skip?: number }} filter
   * @returns {Promise<Garden[]>}
   */
  async findAll(filter) {
    throw new Error("GardenRepository.findAll não implementado");
  }

  /**
   * @param {string} id
   * @returns {Promise<Garden|null>}
   */
  async findById(id) {
    throw new Error("GardenRepository.findById não implementado");
  }

  /**
   * @param {Garden} garden
   * @returns {Promise<Garden>}
   */
  async create(garden) {
    throw new Error("GardenRepository.create não implementado");
  }

  /**
   * @param {string} id
   * @param {Partial<Garden>} update
   * @returns {Promise<Garden|null>}
   */
  async update(id, update) {
    throw new Error("GardenRepository.update não implementado");
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>} true se deletou algo
   */
  async delete(id) {
    throw new Error("GardenRepository.delete não implementado");
  }

  /**
   * @param {string} gardenId
   * @param {import("../../domain/garden").Plant} plant
   * @returns {Promise<import("../../domain/garden").Plant>}
   */
  async addPlant(gardenId, plant) {
    throw new Error("GardenRepository.addPlant não implementado");
  }

  /**
   * @param {string} gardenId
   * @param {string} plantId
   * @param {Partial<import("../../domain/garden").Plant>} update
   * @returns {Promise<import("../../domain/garden").Plant|null>}
   */
  async updatePlant(gardenId, plantId, update) {
    throw new Error("GardenRepository.updatePlant não implementado");
  }
}

module.exports = GardenRepository;


// Porta (interface) para acesso a Gardens na arquitetura limpa.
// Implementações concretas (ex.: via Mongoose) devem cumprir este contrato.

/**
 * @typedef {import("../../domain/garden").Garden} Garden
 */

class GardenRepository {
  /**
   * @param {{ phase?: string, environment?: string, limit?: number, skip?: number }} filter
   * @param {string} ownerId - JWT sub / User._id
   * @returns {Promise<Garden[]>}
   */
  async findAll(filter, ownerId) {
    throw new Error("GardenRepository.findAll não implementado");
  }

  /**
   * @param {string} id
   * @param {string} ownerId
   * @returns {Promise<Garden|null>}
   */
  async findById(id, ownerId) {
    throw new Error("GardenRepository.findById não implementado");
  }

  /**
   * @param {Garden & { ownerId: string|import("mongoose").Types.ObjectId }} garden
   * @returns {Promise<Garden>}
   */
  async create(garden) {
    throw new Error("GardenRepository.create não implementado");
  }

  /**
   * @param {string} id
   * @param {Partial<Garden>} update
   * @param {string} ownerId
   * @returns {Promise<Garden|null>}
   */
  async update(id, update, ownerId) {
    throw new Error("GardenRepository.update não implementado");
  }

  /**
   * @param {string} id
   * @param {string} ownerId
   * @returns {Promise<boolean>} true se deletou algo
   */
  async delete(id, ownerId) {
    throw new Error("GardenRepository.delete não implementado");
  }

  /**
   * @param {string} gardenId
   * @param {import("../../domain/garden").Plant} plant
   * @param {string} ownerId
   * @returns {Promise<import("../../domain/garden").Plant>}
   */
  async addPlant(gardenId, plant, ownerId) {
    throw new Error("GardenRepository.addPlant não implementado");
  }

  /**
   * @param {string} gardenId
   * @param {string} plantId
   * @param {Partial<import("../../domain/garden").Plant>} update
   * @param {string} ownerId
   * @returns {Promise<import("../../domain/garden").Plant|null>}
   */
  async updatePlant(gardenId, plantId, update, ownerId) {
    throw new Error("GardenRepository.updatePlant não implementado");
  }

  /**
   * @param {string} gardenId
   * @param {string} plantId
   * @param {string} ownerId
   * @returns {Promise<boolean>} true se removeu algo
   */
  async deletePlant(gardenId, plantId, ownerId) {
    throw new Error("GardenRepository.deletePlant não implementado");
  }
}

module.exports = GardenRepository;

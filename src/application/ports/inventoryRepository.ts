// Porta (interface) para acesso a itens de estoque na arquitetura limpa.

/**
 * @typedef {import("../../domain/inventoryItem").InventoryItem} InventoryItem
 */

class InventoryRepository {
  /**
   * @param {{ category?: string, limit?: number, skip?: number }} filter
   * @param {string} ownerId
   * @returns {Promise<InventoryItem[]>}
   */
  async findAll(filter, ownerId) {
    throw new Error("InventoryRepository.findAll não implementado");
  }

  /**
   * @param {string} id
   * @param {string} ownerId
   * @returns {Promise<InventoryItem|null>}
   */
  async findById(id, ownerId) {
    throw new Error("InventoryRepository.findById não implementado");
  }

  /**
   * @param {InventoryItem & { ownerId: string|import("mongoose").Types.ObjectId }} item
   * @returns {Promise<InventoryItem>}
   */
  async create(item) {
    throw new Error("InventoryRepository.create não implementado");
  }

  /**
   * @param {string} id
   * @param {Partial<InventoryItem>} update
   * @param {string} ownerId
   * @returns {Promise<InventoryItem|null>}
   */
  async update(id, update, ownerId) {
    throw new Error("InventoryRepository.update não implementado");
  }

  /**
   * @param {string} id
   * @param {string} ownerId
   * @returns {Promise<boolean>}
   */
  async delete(id, ownerId) {
    throw new Error("InventoryRepository.delete não implementado");
  }

  /**
   * @param {string} ownerId
   * @returns {Promise<InventoryItem[]>}
   */
  async findLowStock(ownerId) {
    throw new Error("InventoryRepository.findLowStock não implementado");
  }
}

module.exports = InventoryRepository;

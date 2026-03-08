// Porta (interface) para acesso a itens de estoque na arquitetura limpa.

/**
 * @typedef {import("../../domain/inventoryItem").InventoryItem} InventoryItem
 */

class InventoryRepository {
  /**
   * @param {{ category?: string, limit?: number, skip?: number }} filter
   * @returns {Promise<InventoryItem[]>}
   */
  async findAll(filter) {
    throw new Error("InventoryRepository.findAll não implementado");
  }

  /**
   * @param {string} id
   * @returns {Promise<InventoryItem|null>}
   */
  async findById(id) {
    throw new Error("InventoryRepository.findById não implementado");
  }

  /**
   * @param {InventoryItem} item
   * @returns {Promise<InventoryItem>}
   */
  async create(item) {
    throw new Error("InventoryRepository.create não implementado");
  }

  /**
   * @param {string} id
   * @param {Partial<InventoryItem>} update
   * @returns {Promise<InventoryItem|null>}
   */
  async update(id, update) {
    throw new Error("InventoryRepository.update não implementado");
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error("InventoryRepository.delete não implementado");
  }

  /**
   * @returns {Promise<InventoryItem[]>}
   */
  async findLowStock() {
    throw new Error("InventoryRepository.findLowStock não implementado");
  }
}

module.exports = InventoryRepository;


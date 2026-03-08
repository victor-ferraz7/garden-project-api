/**
 * Caso de uso: criar um novo item de estoque.
 */
class CreateInventoryItem {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {import("../../../domain/inventoryItem").InventoryItem} input
   * @returns {Promise<import("../../../domain/inventoryItem").InventoryItem>}
   */
  async execute(input) {
    return this.inventoryRepository.create(input);
  }
}

module.exports = CreateInventoryItem;

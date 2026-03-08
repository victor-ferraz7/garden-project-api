/**
 * Caso de uso: listar itens com quantidade <= minStock.
 */
class ListLowStockItems {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @returns {Promise<import("../../../domain/inventoryItem").InventoryItem[]>}
   */
  async execute() {
    return this.inventoryRepository.findLowStock();
  }
}

module.exports = ListLowStockItems;

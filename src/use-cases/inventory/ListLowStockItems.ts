/**
 * Caso de uso: listar itens com quantidade <= minStock.
 */
class ListLowStockItems {
  declare inventoryRepository: any;
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ actorId: string }} input
   */
  async execute(input) {
    return this.inventoryRepository.findLowStock(input.actorId);
  }
}

module.exports = ListLowStockItems;

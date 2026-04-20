const { NotFoundError } = require("../../domain/errors");

function stripImmutable(update) {
  if (!update || typeof update !== "object") return update;
  const { ownerId: _o, id: _i, ...rest } = update;
  return rest;
}

/**
 * Caso de uso: atualizar item de estoque.
 */
class UpdateInventoryItem {
  declare inventoryRepository: any;
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ id: string, update: object, actorId: string }} input
   */
  async execute(input) {
    const item = await this.inventoryRepository.update(
      input.id,
      stripImmutable(input.update),
      input.actorId
    );
    if (!item) throw new NotFoundError("Item não encontrado");
    return item;
  }
}

module.exports = UpdateInventoryItem;

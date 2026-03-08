// Entidade de domínio InventoryItem (sem dependência de Mongoose)

/**
 * @typedef {Object} InventoryItem
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} quantity
 * @property {string} unit
 * @property {number} minStock
 * @property {string} [notes]
 * @property {Date} lastUpdated
 */

/**
 * @param {InventoryItem} props
 * @returns {InventoryItem}
 */
function createInventoryItem(props) {
  return {
    notes: "",
    ...props,
  };
}

module.exports = {
  createInventoryItem,
};


// Entidades de domínio puras (sem Mongoose / Express)

/**
 * @typedef {Object} Plant
 * @property {string} id
 * @property {string} name
 * @property {string} [strain]
 * @property {"healthy"|"thirsty"|string} [status]
 * @property {number} [ageDays]
 * @property {"seed"|"clone"|string} [origin]
 * @property {string} [seedBank]
 * @property {"sativa"|"indica"|"hybrid"|"unknown"|string} [phenotype]
 * @property {string|number} [potSize]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} GardenStats
 * @property {string} [temp]
 * @property {string} [hum]
 * @property {string} [tempTarget]
 * @property {string} [humTarget]
 */

/**
 * @typedef {Object} Garden
 * @property {string} id
 * @property {string} name
 * @property {"veg"|"flower"|"nursery"|"drying"|"mother"|string} phase
 * @property {"indoor"|"outdoor"|"hydroponic_indoor"|"hydroponic_outdoor"|string} environment
 * @property {number} day
 * @property {number} plantsCount
 * @property {Date} startDate
 * @property {Date|null} [lastWateredDate]
 * @property {GardenStats} [stats]
 * @property {string} [imageColor]
 * @property {string} [lightType]
 * @property {string} [watts]
 * @property {string} [photoperiod]
 * @property {string} [substrate]
 * @property {Plant[]} [plants]
 */

/**
 * Fábrica simples de Garden de domínio.
 * Não conhece Mongoose nem detalhes de armazenamento.
 * @param {Garden} props
 * @returns {Garden}
 */
function createGarden(props) {
  return {
    plants: [],
    stats: {},
    ...props,
  };
}

module.exports = {
  createGarden,
};


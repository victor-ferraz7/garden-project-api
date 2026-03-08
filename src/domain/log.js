// Entidade de domínio Log (sem dependência de Mongoose)

/**
 * @typedef {Object} Log
 * @property {string} [id]           // id de negócio opcional
 * @property {string} gardenId
 * @property {string} [gardenName]
 * @property {"water"|"prune"|"defoliate"|"pest"|"fungi"|"transplant"|"flush"|"note"|"photo"|string} type
 * @property {string} [note]
 * @property {Date} date
 * @property {string} [ph]
 * @property {string} [ec]
 * @property {string} [water_liters}
 * @property {string} [nutrients_ml]
 * @property {string} [solution_temp]
 * @property {string} [training_type]
 * @property {string} [intensity]
 * @property {string} [product]
 * @property {string} [dosage]
 * @property {string} [application_mode]
 * @property {string} [safety_period]
 */

/**
 * @param {Log} props
 * @returns {Log}
 */
function createLog(props) {
  return {
    note: "",
    ...props,
  };
}

module.exports = {
  createLog,
};


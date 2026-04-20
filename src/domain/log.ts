// Entidade de domínio Log (sem dependência de Mongoose)

/**
 * @typedef {Object} Log
 * @property {string} [id]           // id de negócio opcional
 * @property {string} gardenId
 * @property {string} [gardenName]
 * @property {"water"|"prune"|"defoliate"|"pest"|"fungi"|"transplant"|"flush"|"harvest"|"note"|"photo"|string} type
 * @property {string} [note]
 * @property {Date} date
 * @property {string} [ph]
 * @property {string} [ec]
 * @property {string} [runoff_ec]
 * @property {string} [water_liters]
 * @property {string} [nutrients_ml]
 * @property {string} [solution_temp]
 * @property {string} [vpd]
 * @property {string} [ppfd]
 * @property {string} [co2_ppm]
 * @property {string} [photoperiod]
 * @property {string} [substrate_composition]
 * @property {string} [fertilizer_type]
 * @property {string} [fertilization_date]
 * @property {string} [plant_height_cm]
 * @property {string} [harvest_forecast_date]
 * @property {string} [plant_cost]
 * @property {string} [stress_observation]
 * @property {string} [training_type]
 * @property {string} [technique_applied]
 * @property {string} [intensity]
 * @property {string} [product]
 * @property {string} [dosage]
 * @property {string} [application_mode]
 * @property {string} [pest_inspection]
 * @property {string} [safety_period]
 * @property {string} [wet_weight]
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


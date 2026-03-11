const mongoose = require("mongoose");

// 4.2 — Schema de Log: campos comuns + opcionais por tipo, índices gardenId/date

const LOG_TYPES = [
  "water",
  "prune",
  "defoliate",
  "pest",
  "fungi",
  "transplant",
  "flush",
  "harvest",
  "note",
  "photo",
];

const logSchema = new mongoose.Schema(
  {
    id: { type: String, default: null },
    gardenId: { type: String, required: true },
    gardenName: { type: String, default: "" },
    type: {
      type: String,
      required: true,
      enum: LOG_TYPES,
    },
    note: { type: String, default: "" },
    date: { type: Date, required: true },
    // water
    ph: { type: String, default: null },
    ec: { type: String, default: null },
    water_liters: { type: String, default: null },
    nutrients_ml: { type: String, default: null },
    solution_temp: { type: String, default: null },
    // prune / defoliate
    training_type: { type: String, default: null },
    intensity: { type: String, default: null },
    // pest / fungi
    product: { type: String, default: null },
    dosage: { type: String, default: null },
    application_mode: { type: String, default: null },
    safety_period: { type: String, default: null },
    // harvest
    wet_weight: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "logs",
  }
);

logSchema.index({ gardenId: 1, date: -1 });
logSchema.index({ type: 1 });

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
module.exports.LOG_TYPES = LOG_TYPES;

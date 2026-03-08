const mongoose = require("mongoose");

// 4.1 — Enums e subdocumentos para Garden + Plant

const PHASES = ["veg", "flower", "nursery", "drying", "mother"];
const ENVIRONMENTS = [
  "indoor",
  "outdoor",
  "hydroponic_indoor",
  "hydroponic_outdoor",
];
const PLANT_STATUSES = ["healthy", "thirsty"];

const plantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    strain: { type: String, default: "" },
    status: {
      type: String,
      default: "healthy",
      enum: { values: PLANT_STATUSES, message: "Status da planta inválido" },
    },
    ageDays: { type: Number, default: 0 },
    origin: { type: String, enum: ["seed", "clone"], default: "seed" },
    seedBank: { type: String, default: "" },
    phenotype: {
      type: String,
      enum: ["sativa", "indica", "hybrid", "unknown", ""],
      default: "",
    },
    potSize: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    temp: { type: String, default: "" },
    hum: { type: String, default: "" },
    tempTarget: { type: String, default: "" },
    humTarget: { type: String, default: "" },
  },
  { _id: false }
);

const gardenSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phase: {
      type: String,
      required: true,
      enum: PHASES,
    },
    environment: {
      type: String,
      required: true,
      enum: ENVIRONMENTS,
    },
    day: { type: Number, required: true, default: 0 },
    plantsCount: { type: Number, required: true, default: 0 },
    startDate: { type: Date, required: true },
    lastWateredDate: { type: Date, default: null },
    stats: {
      type: statsSchema,
      default: () => ({}),
    },
    imageColor: { type: String, default: "" },
    lightType: { type: String, default: "" },
    watts: { type: String, default: "" },
    photoperiod: { type: String, default: "" },
    substrate: { type: String, default: "" },
    plants: {
      type: [plantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "gardens",
  }
);

gardenSchema.index({ phase: 1 });
gardenSchema.index({ environment: 1 });
gardenSchema.index({ startDate: 1 });
gardenSchema.index({ id: 1 });

const Garden = mongoose.model("Garden", gardenSchema);

module.exports = Garden;
module.exports.PHASES = PHASES;
module.exports.ENVIRONMENTS = ENVIRONMENTS;
module.exports.PLANT_STATUSES = PLANT_STATUSES;

/**
 * 6. Seed de dados a partir do mockData.js
 * Conecta ao MongoDB, limpa as coleções e insere jardins, logs e itens de estoque.
 */
require("dotenv").config();
const mongoose = require("mongoose");

const { Garden, Log, InventoryItem } = require("../models");
const { GARDENS_MOCK, RECENT_LOGS, INVENTORY_MOCK } = require("./mockData");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/growapp";

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[seed] Conectado ao MongoDB");

    console.log("[seed] Limpando coleções...");
    await Garden.deleteMany({});
    await Log.deleteMany({});
    await InventoryItem.deleteMany({});

    console.log("[seed] Inserindo jardins...");
    const gardens = await Garden.insertMany(GARDENS_MOCK);
    console.log("[seed] Inserindo logs...");
    const logs = await Log.insertMany(RECENT_LOGS);
    console.log("[seed] Inserindo itens de estoque...");
    const items = await InventoryItem.insertMany(INVENTORY_MOCK);

    console.log("[seed] Concluído:", {
      gardens: gardens.length,
      logs: logs.length,
      inventory: items.length,
    });
  } catch (err) {
    console.error("[seed] Erro:", err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[seed] Conexão fechada.");
    process.exit(0);
  }
}

runSeed();

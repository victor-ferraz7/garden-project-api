/**
 * Seed: limpa coleções, cria usuário demo, insere jardins/logs/estoque com ownerId.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Garden, Log, InventoryItem, User, RefreshToken } = require("../models");
const { GARDENS_MOCK, RECENT_LOGS, INVENTORY_MOCK } = require("./mockData");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/growapp";

const SEED_EMAIL = process.env.SEED_USER_EMAIL || "seed@growapp.local";
const SEED_PASSWORD = process.env.SEED_USER_PASSWORD || "seedseed";

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[seed] Conectado ao MongoDB");

    console.log("[seed] Limpando coleções...");
    await RefreshToken.deleteMany({});
    await Garden.deleteMany({});
    await Log.deleteMany({});
    await InventoryItem.deleteMany({});
    await User.deleteMany({});

    console.log("[seed] Criando usuário demo...");
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
    const user = await User.create({ email: SEED_EMAIL, passwordHash });
    const ownerId = user._id;
    console.log("[seed] Usuário:", SEED_EMAIL, "| senha:", SEED_PASSWORD, "| id:", ownerId.toString());

    const withOwner = (docs) => docs.map((d) => ({ ...d, ownerId }));

    console.log("[seed] Inserindo jardins...");
    const gardens = await Garden.insertMany(withOwner(GARDENS_MOCK));
    console.log("[seed] Inserindo logs...");
    const logs = await Log.insertMany(withOwner(RECENT_LOGS));
    console.log("[seed] Inserindo itens de estoque...");
    const items = await InventoryItem.insertMany(withOwner(INVENTORY_MOCK));

    console.log("[seed] Concluído:", {
      userId: ownerId.toString(),
      gardens: gardens.length,
      logs: logs.length,
      inventory: items.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[seed] Erro:", msg);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[seed] Conexão fechada.");
    process.exit(0);
  }
}

runSeed();

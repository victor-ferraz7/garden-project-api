/**
 * Seed: limpa coleções, cria usuário demo, insere jardins/logs/estoque com ownerId.
 */
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Garden, Log, InventoryItem, User, RefreshToken } = require("../models");
const { GARDENS_MOCK, RECENT_LOGS, INVENTORY_MOCK } = require("./mockData");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/growapp";

const SEED_EMAIL = process.env.SEED_USER_EMAIL || "seed@growapp.local";

function requireSeedConfirmation() {
  const confirm = process.env.SEED_CONFIRM;
  if (confirm !== "1" && confirm !== "YES" && confirm !== "true") {
    console.error(
      "[seed] Abortado: este script apaga todos os dados das coleções do app no banco configurado."
    );
    console.error("[seed] Para executar, defina SEED_CONFIRM=1 (ou YES) no ambiente.");
    process.exit(1);
  }
}

function resolveSeedPassword() {
  const fromEnv = process.env.SEED_USER_PASSWORD;
  if (fromEnv && String(fromEnv).length >= 12) {
    return String(fromEnv);
  }
  const generated = crypto.randomBytes(18).toString("base64url");
  console.warn(
    "[seed] SEED_USER_PASSWORD ausente ou curta; foi gerada uma senha aleatória (veja o log abaixo)."
  );
  return generated;
}

async function runSeed() {
  requireSeedConfirmation();

  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_IN_PRODUCTION !== "1") {
    console.error(
      "[seed] Abortado em NODE_ENV=production. Defina SEED_ALLOW_IN_PRODUCTION=1 se realmente deseja rodar o seed neste ambiente."
    );
    process.exit(1);
  }

  const SEED_PASSWORD = resolveSeedPassword();

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
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);
    const user = await User.create({ email: SEED_EMAIL, passwordHash });
    const ownerId = user._id;
    console.log("[seed] Usuário:", SEED_EMAIL, "| id:", ownerId.toString());
    console.log("[seed] Senha desta execução (guarde com segurança):", SEED_PASSWORD);

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

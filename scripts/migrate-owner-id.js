/**
 * Migração one-off: atribui o mesmo ownerId a documentos que ainda não o possuem.
 *
 * Uso:
 *   MONGO_URI=mongodb://localhost:27017/growapp MIGRATE_OWNER_ID=<24-hex ObjectId> node scripts/migrate-owner-id.js
 *
 * Ajuste as coleções conforme seu ambiente. Revise antes de rodar em produção.
 */
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/growapp";
const OWNER = process.env.MIGRATE_OWNER_ID;

async function main() {
  if (!OWNER || !mongoose.Types.ObjectId.isValid(OWNER)) {
    console.error("Defina MIGRATE_OWNER_ID com um ObjectId válido (24 caracteres hex).");
    process.exit(1);
  }
  const ownerId = new mongoose.Types.ObjectId(OWNER);
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const gardens = await db.collection("gardens").updateMany(
    { $or: [{ ownerId: { $exists: false } }, { ownerId: null }] },
    { $set: { ownerId } }
  );
  const logs = await db.collection("logs").updateMany(
    { $or: [{ ownerId: { $exists: false } }, { ownerId: null }] },
    { $set: { ownerId } }
  );
  const inventory = await db.collection("inventoryItems").updateMany(
    { $or: [{ ownerId: { $exists: false } }, { ownerId: null }] },
    { $set: { ownerId } }
  );

  console.log("Atualizado:", {
    gardens: gardens.modifiedCount,
    logs: logs.modifiedCount,
    inventoryItems: inventory.modifiedCount,
  });
  await mongoose.connection.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

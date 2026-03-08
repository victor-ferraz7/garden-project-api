const mongoose = require("mongoose");

const connectDatabase = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/growapp";

  try {
    await mongoose.connect(uri);
    console.log("[database] Conectado ao MongoDB");
  } catch (error) {
    console.error("[database] Erro ao conectar ao MongoDB:", error.message);
    throw error;
  }
};

module.exports = connectDatabase;


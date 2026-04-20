require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`[server] Servidor ouvindo na porta ${PORT}`);
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[server] Falha ao iniciar o servidor:", msg);
    process.exit(1);
  }
};

startServer();


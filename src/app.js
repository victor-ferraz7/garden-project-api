const express = require("express");
const cors = require("cors");

const gardensRoutes = require("./routes/gardens.routes");
const logsRoutes = require("./routes/logs.routes");
const inventoryRoutes = require("./routes/inventory.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 5. Resumo dos endpoints REST (documentação da API)
app.get("/api", (req, res) => {
  res.json({
    name: "gp-api",
    description: "API REST para jardins, logs de cultivo e estoque.",
    basePath: "/api",
    endpoints: {
      gardens: {
        "GET /api/gardens": "Lista jardins. Query: phase, environment, limit, skip",
        "GET /api/gardens/:id": "Jardim por id",
        "GET /api/gardens/:id/logs": "Timeline de logs do jardim",
        "GET /api/gardens/:id/plants": "Plantas do jardim",
        "GET /api/gardens/:id/plants/:plantId": "Planta por id",
        "POST /api/gardens": "Cria jardim",
        "PUT /api/gardens/:id": "Atualiza jardim",
        "DELETE /api/gardens/:id": "Remove jardim",
        "POST /api/gardens/:id/plants": "Adiciona planta",
        "PATCH /api/gardens/:id/plants/:plantId": "Atualiza planta",
        "DELETE /api/gardens/:id/plants/:plantId": "Remove planta",
      },
      logs: {
        "GET /api/logs": "Lista logs. Query: gardenId, type, fromDate, toDate, limit, skip",
        "GET /api/logs/:id": "Log por _id (MongoDB)",
        "POST /api/logs": "Cria log",
        "PUT /api/logs/:id": "Atualiza log",
        "DELETE /api/logs/:id": "Remove log",
      },
      inventory: {
        "GET /api/inventory": "Lista itens. Query: category, limit, skip",
        "GET /api/inventory/low-stock": "Itens com quantity <= minStock",
        "GET /api/inventory/:id": "Item por id",
        "POST /api/inventory": "Cria item",
        "PATCH /api/inventory/:id": "Atualiza item",
        "DELETE /api/inventory/:id": "Remove item",
      },
    },
  });
});

app.use("/api/gardens", gardensRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/inventory", inventoryRoutes);

// 5. Handler 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada", path: req.path });
});

// Fase 4 — Middleware de erro global (erros de domínio + Mongoose → HTTP)
const errorMiddleware = require("./infrastructure/errorMiddleware");
app.use(errorMiddleware);

module.exports = app;


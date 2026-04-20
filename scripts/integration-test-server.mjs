/**
 * Sobe Mongo em memória + API compilada (dist) para testes Playwright.
 * Encerra com SIGTERM/SIGINT (usado pelo runner do Playwright).
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { MongoMemoryServer } from "mongodb-memory-server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();

const port = process.env.PORT || "3999";
const child = spawn(process.execPath, ["dist/server.js"], {
  cwd: root,
  env: {
    ...process.env,
    MONGO_URI: uri,
    PORT: port,
    NODE_ENV: "test",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "test-jwt-access-secret-min-16",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "test-jwt-refresh-secret-min-16",
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "2s",
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
  },
  stdio: "inherit",
});

async function shutdown() {
  child.kill("SIGTERM");
  await new Promise((r) => setTimeout(r, 500));
  try {
    child.kill("SIGKILL");
  } catch {
    /* ignore */
  }
  await mongod.stop();
}

process.on("SIGINT", () => void shutdown().then(() => process.exit(0)));
process.on("SIGTERM", () => void shutdown().then(() => process.exit(0)));
child.on("exit", (code) => {
  void mongod.stop().finally(() => process.exit(code ?? 0));
});

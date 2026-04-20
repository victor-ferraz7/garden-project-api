import { test, expect } from "@playwright/test";

function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}.${Math.random().toString(16).slice(2)}@test.local`;
}

test.describe("PLANO_IMPLEMENTACAO1 §9 — integração API", () => {
  test("login com credenciais erradas → 401 (sem vazar existência de email)", async ({ request }) => {
    const email = uniqueEmail("wrong");
    const res = await request.post("/api/auth/login", {
      data: { email, password: "definitely-wrong-pass" },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBeTruthy();
    const text = JSON.stringify(body);
    expect(text.toLowerCase()).not.toContain("cadastrado");
    expect(text.toLowerCase()).not.toContain("não existe");
  });

  test("access expirado → 401; refresh válido → novo access", async ({ request }) => {
    const email = uniqueEmail("refresh");
    const password = "password123";
    const reg = await request.post("/api/auth/register", { data: { email, password } });
    expect(reg.status()).toBe(201);
    const login = await request.post("/api/auth/login", { data: { email, password } });
    expect(login.ok()).toBeTruthy();
    const { accessToken, refreshToken } = await login.json();
    await new Promise((r) => setTimeout(r, 3500));
    const stale = await request.get("/api/gardens", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(stale.status()).toBe(401);
    const refreshed = await request.post("/api/auth/refresh", {
      data: { refreshToken },
    });
    expect(refreshed.ok()).toBeTruthy();
    const { accessToken: nextAccess } = await refreshed.json();
    const ok = await request.get("/api/gardens", {
      headers: { Authorization: `Bearer ${nextAccess}` },
    });
    expect(ok.ok()).toBeTruthy();
  });

  test("recurso de outro usuário → 404", async ({ request }) => {
    const pass = "password123";
    const emailA = uniqueEmail("usera");
    const emailB = uniqueEmail("userb");
    await request.post("/api/auth/register", { data: { email: emailA, password: pass } });
    await request.post("/api/auth/register", { data: { email: emailB, password: pass } });
    const loginA = await request.post("/api/auth/login", { data: { email: emailA, password: pass } });
    const loginB = await request.post("/api/auth/login", { data: { email: emailB, password: pass } });
    const { accessToken: tokenA } = await loginA.json();
    const { accessToken: tokenB } = await loginB.json();
    const gardenBody = {
      id: `g-${Date.now()}`,
      name: "Jardim A",
      phase: "veg",
      environment: "indoor",
      day: 1,
      plantsCount: 0,
      startDate: new Date().toISOString(),
    };
    const created = await request.post("/api/gardens", {
      headers: { Authorization: `Bearer ${tokenA}` },
      data: gardenBody,
    });
    expect(created.status()).toBe(201);
    const other = await request.get(`/api/gardens/${gardenBody.id}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    expect(other.status()).toBe(404);
  });

  test("CRUD de jardim isolado por owner", async ({ request }) => {
    const email = uniqueEmail("crud");
    const password = "password123";
    await request.post("/api/auth/register", { data: { email, password } });
    const login = await request.post("/api/auth/login", { data: { email, password } });
    const { accessToken } = await login.json();
    const auth = { Authorization: `Bearer ${accessToken}` };
    const id = `g-crud-${Date.now()}`;
    const create = await request.post("/api/gardens", {
      headers: auth,
      data: {
        id,
        name: "CRUD",
        phase: "veg",
        environment: "indoor",
        day: 0,
        plantsCount: 0,
        startDate: new Date().toISOString(),
      },
    });
    expect(create.status()).toBe(201);
    const get1 = await request.get(`/api/gardens/${id}`, { headers: auth });
    expect(get1.ok()).toBeTruthy();
    const body = await get1.json();
    expect(body.name).toBe("CRUD");
    const upd = await request.put(`/api/gardens/${id}`, {
      headers: auth,
      data: { name: "CRUD atualizado" },
    });
    expect(upd.ok()).toBeTruthy();
    const get2 = await request.get(`/api/gardens/${id}`, { headers: auth });
    expect((await get2.json()).name).toBe("CRUD atualizado");
    const del = await request.delete(`/api/gardens/${id}`, { headers: auth });
    expect(del.status()).toBe(204);
    const get3 = await request.get(`/api/gardens/${id}`, { headers: auth });
    expect(get3.status()).toBe(404);
  });
});

import { describe, it, expect, vi } from "vitest";

const { signAccessToken } = require("../../../dist/infrastructure/jwt.js");
const authenticate = require("../../../dist/infrastructure/authenticate.js");

describe("infrastructure/authenticate", () => {
  it("sem Bearer → chama next com UnauthorizedError", async () => {
    const next = vi.fn();
    await authenticate({ headers: {} } as never, {} as never, next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err.name).toBe("UnauthorizedError");
  });

  it("token válido (JWT real) → req.auth.sub e next()", async () => {
    const token = await signAccessToken("user-id-1");
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = vi.fn();
    await authenticate(req as never, {} as never, next);
    expect((req as { auth?: { sub: string } }).auth).toEqual({ sub: "user-id-1" });
    expect(next).toHaveBeenCalledWith();
  });

  it("token inválido → next com UnauthorizedError", async () => {
    const next = vi.fn();
    await authenticate(
      { headers: { authorization: "Bearer not-a-jwt" } } as never,
      {} as never,
      next
    );
    expect(next.mock.calls[0][0].name).toBe("UnauthorizedError");
  });
});

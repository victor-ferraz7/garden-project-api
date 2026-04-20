const { decodeJwt } = require("jose");
const { UnauthorizedError } = require("../../domain/errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  newJti: createJti,
} = require("../../infrastructure/jwt");
const { hashRefreshToken } = require("../../infrastructure/refreshTokenHash");

class RefreshSession {
  declare refreshTokenRepository: any;
  constructor(refreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  /**
   * @param {{ refreshToken: string }} input
   * @returns {Promise<{ accessToken: string, refreshToken: string, tokenType: string }>}
   */
  async execute(input) {
    const refreshToken = input.refreshToken;
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new UnauthorizedError("Refresh token ausente");
    }
    const { sub, jti } = await verifyRefreshToken(refreshToken);
    const session = await this.refreshTokenRepository.findValidByJti(jti, refreshToken);
    if (!session) {
      throw new UnauthorizedError("Sessão inválida");
    }
    const nextJti = createJti();
    await this.refreshTokenRepository.revoke(jti, nextJti);
    const accessToken = await signAccessToken(sub);
    const nextRefresh = await signRefreshToken(sub, nextJti);
    const { exp } = decodeJwt(nextRefresh);
    await this.refreshTokenRepository.create({
      userId: session.userId,
      jti: nextJti,
      hashedToken: hashRefreshToken(nextRefresh),
      expiresAt: new Date(exp * 1000),
      createdFromIp: input.createdFromIp || null,
      userAgent: input.userAgent || null,
    });
    return { accessToken, refreshToken: nextRefresh, tokenType: "Bearer" };
  }
}

module.exports = RefreshSession;

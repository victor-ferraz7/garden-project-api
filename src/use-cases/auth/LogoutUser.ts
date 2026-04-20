const { UnauthorizedError } = require("../../domain/errors");
const { verifyRefreshToken } = require("../../infrastructure/jwt");

class LogoutUser {
  declare refreshTokenRepository: any;
  constructor(refreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  /**
   * @param {{ refreshToken: string }} input
   */
  async execute(input) {
    const refreshToken = input.refreshToken;
    if (!refreshToken || typeof refreshToken !== "string") {
      throw new UnauthorizedError("Refresh token ausente");
    }
    const { jti } = await verifyRefreshToken(refreshToken);
    const session = await this.refreshTokenRepository.findValidByJti(jti, refreshToken);
    if (!session) {
      throw new UnauthorizedError("Sessão inválida");
    }
    await this.refreshTokenRepository.revoke(jti, null);
  }
}

module.exports = LogoutUser;

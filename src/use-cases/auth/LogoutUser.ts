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
    const revoked = await this.refreshTokenRepository.revokeIfActive(jti, refreshToken);
    if (!revoked) {
      throw new UnauthorizedError("Sessão inválida");
    }
  }
}

module.exports = LogoutUser;

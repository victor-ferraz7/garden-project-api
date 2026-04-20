const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { decodeJwt } = require("jose");
const { UnauthorizedError } = require("../../domain/errors");
const { signAccessToken, signRefreshToken, newJti } = require("../../infrastructure/jwt");
const { hashRefreshToken } = require("../../infrastructure/refreshTokenHash");

class LoginUser {
  declare userRepository: any;
  declare refreshTokenRepository: any;
  constructor(userRepository, refreshTokenRepository) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  /**
   * @param {{ email: string, password: string }} input
   * @returns {Promise<{ accessToken: string, refreshToken: string, tokenType: string }>}
   */
  async execute(input) {
    const email = (input.email || "").toLowerCase().trim();
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(input.password || "", user.passwordHash))) {
      throw new UnauthorizedError("Credenciais inválidas");
    }
    const sub = user._id.toString();
    const jti = newJti();
    const accessToken = await signAccessToken(sub);
    const refreshToken = await signRefreshToken(sub, jti);
    const { exp } = decodeJwt(refreshToken);
    await this.refreshTokenRepository.create({
      userId: new mongoose.Types.ObjectId(sub),
      jti,
      hashedToken: hashRefreshToken(refreshToken),
      expiresAt: new Date(exp * 1000),
      createdFromIp: input.createdFromIp || null,
      userAgent: input.userAgent || null,
    });
    return { accessToken, refreshToken, tokenType: "Bearer" };
  }
}

module.exports = LoginUser;

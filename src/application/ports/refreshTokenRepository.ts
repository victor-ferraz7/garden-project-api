class RefreshTokenRepository {
  /**
   * Persiste sessão de refresh (jti + hash do token enviado ao cliente).
   * @param {{
   *   userId: import("mongoose").Types.ObjectId,
   *   jti: string,
   *   hashedToken: string,
   *   expiresAt: Date,
   *   createdFromIp?: string,
   *   userAgent?: string,
   * }} data
   * @returns {Promise<void>}
   */
  async create(data) {
    throw new Error("RefreshTokenRepository.create não implementado");
  }

  /**
   * Sessão ativa: não revogada, não expirada, hash do token coincide.
   * @param {string} jti
   * @param {string} plainRefreshToken - JWT de refresh completo (corpo da requisição)
   * @returns {Promise<{ userId: import("mongoose").Types.ObjectId, jti: string }|null>}
   */
  async findValidByJti(jti, plainRefreshToken) {
    throw new Error("RefreshTokenRepository.findValidByJti não implementado");
  }

  /**
   * @param {string} jti
   * @param {string|null} replacedByJti
   * @returns {Promise<void>}
   */
  async revoke(jti, replacedByJti = null) {
    throw new Error("RefreshTokenRepository.revoke não implementado");
  }

  /**
   * Revoga todas as sessões de refresh do usuário (ex.: logout global).
   * @param {string} userId - ObjectId string
   * @returns {Promise<void>}
   */
  async revokeAllForUser(userId) {
    throw new Error("RefreshTokenRepository.revokeAllForUser não implementado");
  }
}

module.exports = RefreshTokenRepository;

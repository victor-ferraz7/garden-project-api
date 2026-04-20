const RefreshTokenRepository = require("../../application/ports/refreshTokenRepository");
const { RefreshToken } = require("../../models");
const { refreshTokenMatches, hashRefreshToken } = require("../refreshTokenHash");
const { toOwnerObjectId } = require("../mongoId");

class RefreshTokenRepositoryMongo extends RefreshTokenRepository {
  async create(data) {
    await RefreshToken.create(data);
  }

  async findValidByJti(jti, plainRefreshToken) {
    const doc = await RefreshToken.findOne({
      jti,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();
    if (!doc || !refreshTokenMatches(plainRefreshToken, doc.hashedToken)) {
      return null;
    }
    return { userId: doc.userId, jti: doc.jti };
  }

  async consumeForRotation(jti, plainRefreshToken, replacedByJti) {
    const hashed = hashRefreshToken(plainRefreshToken);
    const before = await RefreshToken.findOneAndUpdate(
      {
        jti,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
        hashedToken: hashed,
      },
      { $set: { revokedAt: new Date(), replacedByJti } },
      { returnDocument: "before" }
    ).lean();
    if (!before) return null;
    return { userId: before.userId };
  }

  async revokeIfActive(jti, plainRefreshToken) {
    const hashed = hashRefreshToken(plainRefreshToken);
    const before = await RefreshToken.findOneAndUpdate(
      {
        jti,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
        hashedToken: hashed,
      },
      { $set: { revokedAt: new Date(), replacedByJti: null } },
      { returnDocument: "before" }
    ).lean();
    return !!before;
  }

  async revoke(jti, replacedByJti = null) {
    await RefreshToken.updateOne(
      { jti, revokedAt: null },
      { $set: { revokedAt: new Date(), replacedByJti } }
    );
  }

  async revokeAllForUser(userId) {
    const oid = toOwnerObjectId(userId);
    await RefreshToken.updateMany(
      { userId: oid, revokedAt: null },
      { $set: { revokedAt: new Date(), replacedByJti: null } }
    );
  }
}

module.exports = RefreshTokenRepositoryMongo;

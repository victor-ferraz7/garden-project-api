const crypto = require("crypto");
const { SignJWT, jwtVerify } = require("jose");
const { getAccessSecret, getRefreshSecret, accessExpires, refreshExpires } = require("../config/auth");
const { UnauthorizedError } = require("../domain/errors");

const enc = new TextEncoder();

function accessSecretKey() {
  return enc.encode(getAccessSecret());
}

function refreshSecretKey() {
  return enc.encode(getRefreshSecret());
}

/**
 * @param {string} sub - User._id string
 * @returns {Promise<string>}
 */
async function signAccessToken(sub) {
  return new SignJWT({ typ: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(accessExpires)
    .sign(accessSecretKey());
}

/**
 * @param {string} sub
 * @param {string} jti
 * @returns {Promise<string>}
 */
async function signRefreshToken(sub, jti) {
  return new SignJWT({ typ: "refresh", jti })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(refreshExpires)
    .sign(refreshSecretKey());
}

/**
 * @returns {string}
 */
function newJti() {
  return crypto.randomUUID();
}

/**
 * @param {string} token
 * @returns {Promise<{ sub: string, typ: string, jti?: string }>}
 */
async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, accessSecretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.typ !== "access") throw new UnauthorizedError("Token inválido");
    if (!payload.sub) throw new UnauthorizedError("Token inválido");
    return { sub: String(payload.sub), typ: "access" };
  } catch (e) {
    if (e instanceof UnauthorizedError) throw e;
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}

/**
 * @param {string} token
 * @returns {Promise<{ sub: string, typ: string, jti: string }>}
 */
async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, refreshSecretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.typ !== "refresh") throw new UnauthorizedError("Refresh token inválido");
    const jti = payload.jti ? String(payload.jti) : null;
    if (!payload.sub || !jti) throw new UnauthorizedError("Refresh token inválido");
    return { sub: String(payload.sub), typ: "refresh", jti };
  } catch (e) {
    if (e instanceof UnauthorizedError) throw e;
    throw new UnauthorizedError("Refresh token inválido ou expirado");
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  newJti,
};

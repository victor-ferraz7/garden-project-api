const mongoose = require("mongoose");
const { ValidationError } = require("../domain/errors");

/**
 * Converte string de owner (JWT sub) em ObjectId para queries Mongoose.
 * @param {string} ownerId
 * @returns {import("mongoose").Types.ObjectId}
 */
function toOwnerObjectId(ownerId) {
  if (!ownerId || typeof ownerId !== "string" || !mongoose.Types.ObjectId.isValid(ownerId)) {
    throw new ValidationError("Identificador de usuário inválido");
  }
  return new mongoose.Types.ObjectId(ownerId);
}

module.exports = { toOwnerObjectId };

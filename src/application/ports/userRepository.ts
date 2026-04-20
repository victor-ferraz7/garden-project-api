/**
 * @typedef {{ _id: import("mongoose").Types.ObjectId, email: string, passwordHash: string }} UserDoc
 */

class UserRepository {
  /**
   * @param {string} email - normalizado (lowercase trim)
   * @returns {Promise<UserDoc|null>}
   */
  async findByEmail(email) {
    throw new Error("UserRepository.findByEmail não implementado");
  }

  /**
   * @param {string} id - ObjectId string
   * @returns {Promise<UserDoc|null>}
   */
  async findById(id) {
    throw new Error("UserRepository.findById não implementado");
  }

  /**
   * @param {{ email: string, passwordHash: string }} data
   * @returns {Promise<UserDoc>}
   */
  async create(data) {
    throw new Error("UserRepository.create não implementado");
  }
}

module.exports = UserRepository;

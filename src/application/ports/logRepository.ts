// Porta (interface) para acesso a Logs na arquitetura limpa.

/**
 * @typedef {import("../../domain/log").Log} Log
 */

class LogRepository {
  /**
   * @param {{ gardenId?: string, type?: string, fromDate?: Date, toDate?: Date, limit?: number, skip?: number }} filter
   * @param {string} ownerId
   * @returns {Promise<Log[]>}
   */
  async findAll(filter, ownerId) {
    throw new Error("LogRepository.findAll não implementado");
  }

  /**
   * @param {string} idMongo
   * @param {string} ownerId
   * @returns {Promise<Log|null>}
   */
  async findByMongoId(idMongo, ownerId) {
    throw new Error("LogRepository.findByMongoId não implementado");
  }

  /**
   * @param {Log & { ownerId: string|import("mongoose").Types.ObjectId }} log
   * @returns {Promise<Log>}
   */
  async create(log) {
    throw new Error("LogRepository.create não implementado");
  }

  /**
   * @param {string} idMongo
   * @param {Partial<Log>} update
   * @param {string} ownerId
   * @returns {Promise<Log|null>}
   */
  async update(idMongo, update, ownerId) {
    throw new Error("LogRepository.update não implementado");
  }

  /**
   * @param {string} idMongo
   * @param {string} ownerId
   * @returns {Promise<boolean>}
   */
  async delete(idMongo, ownerId) {
    throw new Error("LogRepository.delete não implementado");
  }
}

module.exports = LogRepository;

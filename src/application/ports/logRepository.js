// Porta (interface) para acesso a Logs na arquitetura limpa.

/**
 * @typedef {import("../../domain/log").Log} Log
 */

class LogRepository {
  /**
   * @param {{ gardenId?: string, type?: string, fromDate?: Date, toDate?: Date, limit?: number, skip?: number }} filter
   * @returns {Promise<Log[]>}
   */
  async findAll(filter) {
    throw new Error("LogRepository.findAll não implementado");
  }

  /**
   * @param {string} idMongo
   * @returns {Promise<Log|null>}
   */
  async findByMongoId(idMongo) {
    throw new Error("LogRepository.findByMongoId não implementado");
  }

  /**
   * @param {Log} log
   * @returns {Promise<Log>}
   */
  async create(log) {
    throw new Error("LogRepository.create não implementado");
  }

  /**
   * @param {string} idMongo
   * @param {Partial<Log>} update
   * @returns {Promise<Log|null>}
   */
  async update(idMongo, update) {
    throw new Error("LogRepository.update não implementado");
  }

  /**
   * @param {string} idMongo
   * @returns {Promise<boolean>}
   */
  async delete(idMongo) {
    throw new Error("LogRepository.delete não implementado");
  }
}

module.exports = LogRepository;


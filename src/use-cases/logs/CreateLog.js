/**
 * Caso de uso: criar um novo log.
 */
class CreateLog {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {import("../../../domain/log").Log} input
   * @returns {Promise<import("../../../domain/log").Log>}
   */
  async execute(input) {
    return this.logRepository.create(input);
  }
}

module.exports = CreateLog;

const bcrypt = require("bcryptjs");
const { ValidationError } = require("../../domain/errors");

const EMAIL_MAX = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmailFormat(email: string) {
  if (email.length > EMAIL_MAX) {
    throw new ValidationError("Email inválido");
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError("Email inválido");
  }
}

function validatePasswordStrength(password: string) {
  if (password.length < 10) {
    throw new ValidationError("Senha deve ter no mínimo 10 caracteres");
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw new ValidationError("Senha deve incluir letras maiúsculas, minúsculas e números");
  }
}

class RegisterUser {
  declare userRepository: any;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @param {{ email: string, password: string }} input
   */
  async execute(input) {
    const email = (input.email || "").toLowerCase().trim();
    const password = input.password;
    if (!email || !password) {
      throw new ValidationError("Email e senha são obrigatórios");
    }
    validateEmailFormat(email);
    validatePasswordStrength(String(password));
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ValidationError("Não foi possível cadastrar com estes dados.");
    }
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      const user = await this.userRepository.create({ email, passwordHash });
      return { id: String(user._id), email: user.email };
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000) {
        throw new ValidationError("Não foi possível cadastrar com estes dados.");
      }
      throw err;
    }
  }
}

module.exports = RegisterUser;

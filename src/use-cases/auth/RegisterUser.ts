const bcrypt = require("bcryptjs");
const { ValidationError } = require("../../domain/errors");

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
    if (password.length < 8) {
      throw new ValidationError("Senha deve ter no mínimo 8 caracteres");
    }
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ValidationError("Email já cadastrado");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.create({ email, passwordHash });
      return { id: String(user._id), email: user.email };
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000) {
        throw new ValidationError("Email já cadastrado");
      }
      throw err;
    }
  }
}

module.exports = RegisterUser;

const UserRepository = require("../../application/ports/userRepository");
const { User } = require("../../models");

class UserRepositoryMongo extends UserRepository {
  async findByEmail(email) {
    const doc = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    return doc || null;
  }

  async findById(id) {
    const doc = await User.findById(id).lean();
    return doc || null;
  }

  async create(data) {
    const doc = await User.create(data);
    return doc.toObject ? doc.toObject() : doc;
  }
}

module.exports = UserRepositoryMongo;

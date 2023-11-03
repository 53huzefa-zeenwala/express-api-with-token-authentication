const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "User",
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
  } catch (error) {
    next(error);
  }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    var update = this.getUpdate();
    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(update.password, salt);
      update.password = hashPassword;
    }
    next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("users", UserSchema);

module.exports = User;

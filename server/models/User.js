const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 4,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 8,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports("user", userSchema);

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
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
  picture: {
    type: String,
  },
  googleOAuth: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  contrattoSelezionato: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contratto",
    required: false,
  },
});
module.exports = mongoose.model("user", userSchema);

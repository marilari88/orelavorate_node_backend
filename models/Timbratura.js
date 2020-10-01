const { string } = require("joi");
const mongoose = require("mongoose");

const TimbraturaSchema = mongoose.Schema(
  {
    ingresso: { type: Date, required: true },
    uscita: Date,
    differenza: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "timbrature" }
);
module.exports = mongoose.model("timbrature", TimbraturaSchema);

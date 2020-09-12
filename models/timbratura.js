const mongoose = require("mongoose");

const TimbraturaSchema = mongoose.Schema(
  {
    ingresso: { type: Date, required: true },
    uscita: Date,
    differenza: String,
  },
  { collection: "timbrature" }
);
module.exports = mongoose.model("timbrature", TimbraturaSchema);

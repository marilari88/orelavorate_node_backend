const { string } = require("joi");
const mongoose = require("mongoose");

const TimbraturaSchema = mongoose.Schema(
  {
    ingresso: { type: Date, required: true },
    uscita: Date,
    differenza: String,
    contrattoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contratto",
      required: true,
    },
    ingressoManuale: { type: Boolean, default: false },
    uscitaManuale: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "timbrature" }
);
module.exports = mongoose.model("timbrature", TimbraturaSchema);

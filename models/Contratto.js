const mongoose = require("mongoose");

const ContrattoSchema = mongoose.Schema(
  {
    nomeContratto: { type: String, required: true },
    nomeAzienda: { type: String, required: true },
    inizioContratto: { type: Date, required: true },
    fineContratto: Date,
    orePrevisteContratto: Number,
    oreLavorateContratto: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "contratti" }
);
module.exports = mongoose.model("contratti", ContrattoSchema);

const mongoose = require("mongoose");

const ContrattoSchema = mongoose.Schema(
  {
    nomeContratto: { type: String, required: true },
    nomeAzienda: { type: String, required: true },
    inizioContratto: { type: Date, required: true },
    fineContratto: Date,
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
  { collection: "contratto" }
);
module.exports = mongoose.model("contratto", ContrattoSchema);

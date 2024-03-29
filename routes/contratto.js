const express = require("express");
const router = express.Router();
const Contratto = require("../models/Contratto");
const verifyToken = require("../middlewares/verifyToken");
const contrattoSchemaValidation = require("../validation/contrattoValidation");

router.get("/", verifyToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "");
    const sort = req.query.order || "";
    const elencoContratti = await Contratto.find({ userId: req.user.id })
      .sort({ inizioContratto: sort })
      .limit(limit);
    res.json(elencoContratti);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const datiContratto = {
    nomeContratto: req.body.nomecontratto,
    nomeAzienda: req.body.nomeazienda,
    inizioContratto: req.body.inizioContratto,
    fineContratto: req.body.fineContratto,
    orePrevisteContratto: req.body.orePrevisteContratto,
    userId: req.user.id,
  };
  try {
    const { error } = contrattoSchemaValidation.validate(datiContratto);
    if (error) throw error.details[0].message;

    const contratto = new Contratto(datiContratto);

    const result = await contratto.save();

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const contratto = await Contratto.findById(req.params.id);
    if (contratto.userId != req.user.id)
      return res
        .status(401)
        .json({ error: "Non sei autorizzato a visualizzare questa risorsa" });
    res.json(contratto);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const contratto = await Contratto.findById(req.params.id);
    if (contratto.userId != req.user.id)
      return res
        .status(401)
        .json({ error: "Non sei autorizzato a modificare questa risorsa" });

    const datiContratto = {
      nomeContratto: req.body.nomecontratto,
      nomeAzienda: req.body.nomeazienda,
      inizioContratto: req.body.inizioContratto,
      fineContratto: req.body.fineContratto,
      orePrevisteContratto: req.body.orePrevisteContratto,
      oreLavorateContratto: req.body.oreLavorateContratto,
      userId: req.user.id,
    };

    const { error } = contrattoSchemaValidation.validate(datiContratto);
    if (error) throw error.details[0].message;

    const contrattoAggiornato = await Contratto.findByIdAndUpdate(
      { _id: req.params.id },
      datiContratto,
      { new: true, lean: true }
    );
    res.status(200).json(contrattoAggiornato);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const contratto = await Contratto.findById(req.params.id);
  if (contratto.userId != req.user.id)
    return res
      .status(401)
      .json({ error: "Non sei autorizzato a visualizzare questa risorsa" });
  try {
    const contrattoCancellato = await Contratto.deleteOne({
      _id: req.params.id,
    });
    res.json(contrattoCancellato);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

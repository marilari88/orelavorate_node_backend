const express = require("express");
const router = express.Router();
const Contratto = require("../models/Contratto");
const verifyToken = require("../middlewares/verifyToken");

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
  const contratto = new Contratto({
    nomeContratto: req.body.nomecontratto,
    nomeAzienda: req.body.nomeazienda,
    inizioContratto: req.body.inizioContratto,
    fineContratto: req.body.fineContratto,
    userId: req.user.id,
  });
  try {
    const result = await contratto.save();
    res.json(result);
  } catch (err) {
    res.json({ error: err });
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

    const contrattoAggiornato = await Contratto.updateOne(
      {
        _id: req.params.id,
      },
      {
        nomeContratto: req.body.nomecontratto,
        nomeAzienda: req.body.nomeazienda,
        inizioContratto: req.body.inizioContratto,
        fineContratto: req.body.fineContratto,
        userId: req.user.id,
      }
    );
    res.json(contrattoAggiornato);
  } catch (err) {
    res.json({ message: err });
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

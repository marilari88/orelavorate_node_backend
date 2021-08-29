const express = require("express");
const router = express.Router();
const Timbratura = require("../models/Timbratura");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "");
    const sort = req.query.order || "";
    const elencoTimbrature = await Timbratura.find({
      contrattoId: req.user.contrattoSelezionato,
    })
      .sort({ ingresso: sort })
      .limit(limit);
    res.json(elencoTimbrature);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const timbratura = new Timbratura({
    ingresso: req.body.ingresso,
    uscita: req.body.uscita,
    differenza: req.body.differenza,
    contrattoId: req.contratto.id,
    ingressoManuale: req.body.ingressoManuale,
    uscitaManuale: req.body.uscitaManuale,
  });
  try {
    const result = await timbratura.save();
    res.json(result);
  } catch (err) {
    res.json({ error: err });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const timbratura = await Timbratura.findById(req.params.id);
    if (timbratura.contrattoId != req.contratto.id)
      return res
        .status(401)
        .json({ error: "Non sei autorizzato a visualizzare questa risorsa" });
    res.json(timbratura);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const timbratura = await Timbratura.findById(req.params.id);
    if (timbratura.contrattoId != req.contratto.id)
      return res
        .status(401)
        .json({ error: "Non sei autorizzato a modificare questa risorsa" });

    const timbraturaAggiornata = await Timbratura.updateOne(
      {
        _id: req.params.id,
      },
      {
        ingresso: req.body.ingresso,
        uscita: req.body.uscita,
        differenza: req.body.differenza,
        ingressoManuale: req.body.ingressoManuale,
        uscitaManuale: req.body.uscitaManuale,
      }
    );
    res.json(timbraturaAggiornata);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const timbratura = await Timbratura.findById(req.params.id);
  if (timbratura.contrattoId != req.contratto.id)
    return res
      .status(401)
      .json({ error: "Non sei autorizzato a visualizzare questa risorsa" });
  try {
    const timbraturaCancellata = await Timbratura.deleteOne({
      _id: req.params.id,
    });
    res.json(timbraturaCancellata);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

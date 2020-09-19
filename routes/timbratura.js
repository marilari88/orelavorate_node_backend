const express = require("express");
const router = express.Router();
const Timbratura = require("../models/timbratura");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "");
    const sort = req.query.order || "";
    const elencoTimbrature = await Timbratura.find()
      .sort({ ingresso: sort })
      .limit(limit);
    res.json(elencoTimbrature);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const timbratura = new Timbratura({
    ingresso: req.body.ingresso,
    uscita: req.body.uscita,
    differenza: req.body.differenza,
  });
  try {
    const result = await timbratura.save();
    console.log(result);
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const timbratura = await Timbratura.findById(req.params.id);
    res.json(timbratura);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const timbraturaAggiornata = await Timbratura.updateOne(
      {
        _id: req.params.id,
      },
      {
        ingresso: req.body.ingresso,
        uscita: req.body.uscita,
        differenza: req.body.differenza,
      }
    );
    res.json(timbraturaAggiornata);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:id", async (req, res) => {
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

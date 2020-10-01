const router = require("express").Router();
const bcrypt = require("bcrypt");
const authSchemaValidation = require("../validation/authValidation");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { error } = authSchemaValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(400).json({ error: "Email già utilizzata" });

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const nuovoUtente = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await nuovoUtente.save();
    res.status(200).json({ message: "Utente Registrato" });
  } catch (error) {
    res.status(400).json({ error: `Registrazione non riuscita: ${error}` });
  }
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Email non trovata" });

  const passwordValidata = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordValidata) return res.status(400).send("Password non corretta");

  const token = await jwt.sign(
    { id: user._id, name: user.name },
    process.env.SECRET_TOKEN
  );

  res
    .header("Authorization", `Bearer ${token}`)
    .send("Login eseguito con Successo");
});

module.exports = router;

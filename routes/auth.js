const router = require("express").Router();
const bcrypt = require("bcrypt");
const authSchemaValidation = require("../validation/authValidation");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const { OAuth2Client } = require("google-auth-library");
const randomString = require("../utils/randomString");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req, res) => {
  const { error } = authSchemaValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(400).json({ error: "Email già utilizzata" });

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.status(200).json({ message: "Utente Registrato" });
  } catch (error) {
    res.status(400).json({ error: `Registrazione non riuscita: ${error}` });
  }
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email non trovata" });

  const passwordValidata = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordValidata)
    return res.status(400).json({ error: "Password non corretta" });

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.SECRET_TOKEN
  );

  res.status(200).json({
    message: "Login eseguito con Successo",
    token: token,
    user: { id: user.id, name: user.name },
  });
});

router.post("/googlelogin", async (req, res) => {
  const tokenId = req.body.tokenid;
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email_verified, email, name, picture } = ticket.getPayload();

  if (!email_verified) {
    return res.status(400).json({
      error:
        "L'email non è stata verificata non è possibile procedere con il login",
    });
  }

  const userExist = await User.findOne({ email: email });
  if (userExist) {
    const token = jwt.sign(
      { id: userExist._id, name: userExist.name },
      process.env.SECRET_TOKEN
    );

    res.status(200).json({
      message: "Login eseguito con Successo",
      token: token,
      user: { id: userExist.id, name: userExist.name },
    });
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(randomString(), salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      googleOAuth: true,
      picture: picture,
    });
    try {
      const savedUser = await newUser.save();

      const token = jwt.sign(
        { id: savedUser._id, name: savedUser.name },
        process.env.SECRET_TOKEN
      );

      res.status(200).json({
        message: "Login eseguito con Successo",
        token: token,
        user: { id: savedUser.id, name: savedUser.name },
      });
    } catch (error) {
      res.status(400).json({ error: `Registrazione non riuscita: ${error}` });
    }
  }
});

router.get("/checktoken", verifyToken, async (req, res) => {
  if (req.user) res.status(200).json({ user: req.user });
});

module.exports = router;

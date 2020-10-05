const jwt = require("jsonwebtoken");
const tokenVerify = async (req, res, next) => {
  const token = req.header("x-access-token");
  try {
    const tokenVerificato = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!tokenVerificato) return res.status(401).send("Accesso negato");
    req.user = tokenVerificato;
  } catch (err) {
    return res.status(401).send("Accesso negato");
  }

  next();
};
module.exports = tokenVerify;

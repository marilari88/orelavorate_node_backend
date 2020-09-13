const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv/config");
const port = process.env.PORT || 5000;

const timbraturaRoute = require("./routes/timbratura");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/timbrature", timbraturaRoute);

mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connesso a MongoDB");
  }
);

app.listen(port, () => {
  console.log(`In ascolto sulla porta ${port}`);
});

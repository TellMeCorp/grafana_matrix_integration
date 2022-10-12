const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routers = require("./routers");
const customErrorHandler = require("./middlewares/errors/errors");

const app = express();
dotenv.config({
  path: "./config/env/config.env",
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT;

app.use("/api/", routers);

app.get("/", function (req, res) {
  res.send("Grafana matrix integration");
});
app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`Uygulama Başlatıldı: http://localhost:${PORT}\n`);
});

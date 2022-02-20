const express = require("express");
const app = express();
require("dotenv/config");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Product = require("./models/product");
const api = process.env.API_URL;

const productsRouter = require("./routers/products");

app.use(express.json());
app.use(morgan("tiny"));

app.use(`${api}/products`, productsRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database conneksiyon ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});

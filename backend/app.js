const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(morgan("tiny"));

const productsRouter = require("./routers/products");
const categoryRouter = require("./routers/categories");
const api = process.env.API_URL;

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database conneksiyon ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(4000, () => {
  console.log("listening on port 3000");
});

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/jwt");
app.use(cors());
app.options("*", cors());
//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

const productsRouter = require("./routers/products");
const categoryRouter = require("./routers/categories");
const userRouter = require("./routers/users");
const api = process.env.API_URL;

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
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

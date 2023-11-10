const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require('cors');

require("dotenv").config();
require("./helpers/init_mongodb");
require("./helpers/init_redis");

const { verifyAccessToken } = require("./helpers/jwt_helper");

const app = express();

app.use(cors())

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  console.log(res.payload);
  res.send("Hello From Express");
});

const AuthRoute = require("./Routes/Auth.route");
app.use("/auth", AuthRoute);

//product route
const productsRoute = require("./Routes/Products.route");
app.use("/products", productsRoute);

// Order route
const ordersRoute = require("./Routes/Orders.route");
app.use("/orders", ordersRoute);

// post route
const postsRoute = require("./Routes/Posts.route");
app.use("/posts", postsRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

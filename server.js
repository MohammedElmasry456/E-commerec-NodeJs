const path = require("path");

const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes");
const { checkoutWebhook } = require("./services/orderService");

//connect with DB
dbConnection();

// express app
const app = express();

app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//checkout webhook
app.post(
  "/webhoock-checkout",
  express.raw({ type: "application/json" }),
  checkoutWebhook
);

//Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//Express middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "quantity",
      "sold",
      "ratingsQuantity",
      "ratingAverage",
    ],
  })
);

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss());

//Mount Routes
mountRoutes(app);
app.get("/", (req, res) => {
  res.json({ message: "hello my world!" });
});
app.all("*", (req, res, next) => {
  next(new ApiError(`cant't find this route ${req.originalUrl}`, 400));
});

//global Error Middleware
app.use(globalError);

const server = app.listen(process.env.PORT, () => {
  console.log(`Run at port ${process.env.PORT}`);
});

//Handle Error Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server Shuting Down....");
    process.exit(1);
  });
});

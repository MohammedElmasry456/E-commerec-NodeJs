const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes");

dotenv.config({ path: "./config.env" });

//connect with DB
dbConnection();

// express app
const app = express();

app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

// compress all responses
app.use(compression());

//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoutes(app);

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

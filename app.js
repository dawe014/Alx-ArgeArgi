const express = require("express");
const expressLayout = require("express-ejs-layouts");
const AppError = require("./utils/AppError");

const landRouter = require("./routes/landRoutes");
const userRouter = require("./routes/userRoutes");
const sellHouseRouter = require("./routes/sellHouseRoutes");
const rentHouseRouter = require("./routes/rentHouseRoutes");
const furnitureRouter = require("./routes/furnitureRoutes");
const globalErrorHandler = require("./controllers/errorController");
const authController = require("./controllers/authController");

const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

const main = require("./routes/main");

app.use(express.static("public"));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// TEMPLATING ENGINE
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies); // This should log cookies if they are present
  next();
});
app.use(express.urlencoded({ extended: true }));

// router.use(authController.isLoggedIn);
console.log('dawe kun app.js keessa')

// Use the main routes
app.use("/", main); // Updated to use the main router
app.use("/api/v1/land", landRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/sellhouse", sellHouseRouter);
app.use("/api/v1/renthouse", rentHouseRouter);
app.use("/api/v1/furniture", furnitureRouter);
// console.log("dawe kun app.js dhuma isaa");

// console.log('dawe')

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;

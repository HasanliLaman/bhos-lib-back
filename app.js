const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./error/errorHandler");
const GlobalError = require("./error/GlobalError");

const app = express();
app.use(express.json());

// Checking environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply some modules for security

// Cors
app.use(cors());

// Routers
const categoryRouter = require("./routers/categoryRouter");
const bookRouter = require("./routers/bookRouter");
const userRouter = require("./routers/userRouter");
const uploadRouter = require("./routers/uploadRouter");

app.use("/categories", categoryRouter);
app.use("/books", bookRouter);
app.use("/users", userRouter);
app.use("/uploads", uploadRouter);

// Catch nonexist routes
app.use((req, res, next) => {
  next(new GlobalError(`${req.originalUrl} does not exist!`, 404));
});

// Error handling
app.use(errorHandler);

module.exports = app;

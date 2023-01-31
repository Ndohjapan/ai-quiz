const express = require("express")
const httpLogger = require("./middleware/httpLogger")
const globalErrorHandler = require("./utils/errorHandler")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const quizRoutes = require("./routes/quiz")
const quizRecordRoute = require("./routes/quizRecord")
const AppError = require("./utils/appError")
const {bruteForce, protect} = require("./middleware/protect")

const app = express()

app.use(express.json());

// Log all the api calls coming to the server
app.use(httpLogger);

app.use(express.urlencoded({ extended: true }));

app.use("/auth", bruteForce.prevent, authRoutes)
app.use("/quiz", protect, quizRoutes)
app.use("/user", protect, userRoutes)
app.use("/participation", protect, quizRecordRoute)
// app.use("/quizCategory")
// app.use("/quizDifficulty")

app.all("*", (req, res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404))
);

app.use(globalErrorHandler);

module.exports = app
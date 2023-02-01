const express = require("express")
const httpLogger = require("./middleware/httpLogger")
const globalErrorHandler = require("./utils/errorHandler")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const quizRoutes = require("./routes/quiz")
const quizRecordRoute = require("./routes/quizRecord")
const inedexRoute = require("./routes/index")
const AppError = require("./utils/appError")
const {bruteForce, protect} = require("./middleware/protect")
const path = require("path")


const app = express()

// Set Up Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());

// Log all the api calls coming to the server
app.use(httpLogger);

app.use(express.urlencoded({ extended: true }));

// Connect to the public files
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", inedexRoute)
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
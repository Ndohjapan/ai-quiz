const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.signup = catchAsync(async(req, res, next) => {
    console.log("We are here")
    res.send("Hello World")
})
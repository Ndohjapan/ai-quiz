const catchAsync = require("../utils/catchAsync")

exports.signup = catchAsync(async(req, res, next) => {
    res.send(authHouse)
})
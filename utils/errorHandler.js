
const sendErrorProd = (err, res) => {
    console.log(err)
    if (err.isOperational) {
        return res
        .status(err.statusCode)
        .json({ status: err.status, error: err.message });
    }
    res.status(500).json({ message: "Something went wrong" });
};

module.exports = (err, req, res, next) => {
    console.log("There was an error")
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    sendErrorProd(err, res);
};
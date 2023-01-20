const express = require("express")
const router = express.Router()
const {signup, verifyOTP, resendOTP, login} = require("../controllers/authControllers")

router.post("/signup", signup)
router.post("/verifyOTP", verifyOTP)
router.post("/resendOTP", resendOTP)
router.post("/login", login)
module.exports = router


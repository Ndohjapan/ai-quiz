const express = require("express")
const router = express.Router()
const {signup, verifyOTP} = require("../controllers/authControllers")

router.post("/signup", signup)
router.post("/verifyOTP", verifyOTP)
module.exports = router


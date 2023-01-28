const express = require("express")
const router = express.Router()
const {getUser, getAllUsers, deleteUser, updateUser, postFilter } = require("../controllers/userController")

router.post("/postFilter", postFilter)
router.get("/", getAllUsers)
router.get("/:id", getUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

module.exports = router
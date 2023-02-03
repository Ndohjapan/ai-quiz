const express = require("express")
const router = express.Router()
const { createDifficulty, deleteDifficulty, getAllDifficulties, getDifficulty } = require("../controllers/difficultyController")

router.post("/", createDifficulty)
router.get("/", getAllDifficulties)
router.get("/:id", getDifficulty)
router.delete("/:id", deleteDifficulty)

module.exports = router
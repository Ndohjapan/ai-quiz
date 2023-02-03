const express = require("express")
const router = express.Router()
const { getQuestions } = require("../controllers/questionsController")

router.post("/", getQuestions)
// router.get("/", getAllDifficulties)
// router.get("/:id", getDifficulty)
// router.delete("/:id", deleteDifficulty)

module.exports = router
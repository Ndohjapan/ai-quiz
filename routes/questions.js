const express = require("express")
const router = express.Router()
const { getQuestions, getAQuestion } = require("../controllers/questionsController")

router.post("/", getQuestions)
// router.get("/", getAllDifficulties)
router.get("/:id", getAQuestion)
// router.delete("/:id", deleteDifficulty)

module.exports = router
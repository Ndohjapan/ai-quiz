const express = require("express")
const router = express.Router()
const { createQuiz, getByUserId, updateQuizById, deletById, getAll, postFilter, getById, joinQuiz } = require("../controllers/quizController")

router.post("/", createQuiz)
router.post("/postFilter", postFilter)
router.post("/joinQuiz", joinQuiz)
router.get("/", getAll)
router.get("/getByUserId", getByUserId)
router.get("/:id", getById)
router.put("/:id", updateQuizById)
router.delete("/:id", deletById)

module.exports = router
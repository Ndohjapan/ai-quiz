const express = require("express")
const router = express.Router()
const { createQuiz, getByUserId, updateQuizById, deletById, getAll, postFilter, getById } = require("../controllers/quizController")

router.post("/", createQuiz)
router.post("/postFilter", postFilter)
router.get("/", getAll)
router.get("/:id", getById)
router.get("/getByUserId", getByUserId)
router.put("/:id", updateQuizById)
router.delete("/:id", deletById)

module.exports = router
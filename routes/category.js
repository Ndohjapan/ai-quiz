const express = require("express")
const router = express.Router()
const {  deleteCategory, createCategory, getCategory, getAllCategories } = require("../controllers/categoryController")

router.post("/", createCategory)
router.get("/", getAllCategories)
router.get("/:id", getCategory)
router.delete("/:id", deleteCategory)

module.exports = router
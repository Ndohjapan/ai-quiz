const express = require("express")
const router = express.Router()
const { createRecord, postFilter, getAllRecords, getRecord, deleteRecord, updateRecord } = require("../controllers/quizRecordController")

router.post("/", createRecord)
router.post("/postFilter", postFilter)
router.get("/", getAllRecords)
router.get("/:id", getRecord)
router.put("/:id", updateRecord)
router.delete("/:id", deleteRecord)

module.exports = router
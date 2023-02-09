const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const toSnakeCase = require("../utils/toSnakeCase")
const jsonToString = require("../utils/jsonToString")
const pool = require("../utils/db")

exports.createRecord = catchAsync(async(req, res, next) => {
    let {quizId, score} = req.body

    let userId = req.user.id

    console.log(userId)

    let {rows} = await pool.query(`
        insert into quiz_result(quiz_id, score, user_id)
        values($1, $2, $3) returning *
    `, [quizId, score, userId])

    res.send({success: true, data: toCamelCase(rows)[0]})

})

exports.getAllRecords = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from quiz_result
    `)

    res.send({success: true, data: toCamelCase(rows)})

})

exports.getRecord = catchAsync(async(req, res, next) => {
    let userId = req.params.id

    let {rows} = await pool.query(`
        select * from quiz_result where id = $1
    `, [userId])

    res.send({success: true, data: toCamelCase(rows)[0]})
})

exports.updateRecord = catchAsync(async(req, res, next) => {
    let data = req.body;
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value != "") {
        updateData[key] = value;
        }
    });

    updateData = toSnakeCase(updateData)

    await pool.query(`
        SELECT update_quiz_result_by_id($1, $2);
    `, [req.params.id, updateData])

    let {rows} = await pool.query(`
        select * from quiz_result where id=$1
    `, [req.params.id])

    res.send({success: true, data: toCamelCase(rows)[0]})
})

exports.deleteRecord = catchAsync(async(req, res, next) => {
    await pool.query(`
        delete from quiz_result where id = $1
    `, [req.params.id])

    res.status(204).send({success: true, message: "Deleted Successfully"})
})

exports.postFilter = catchAsync(async(req, res, next) => {
    let data = req.body;
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value != "") {
        updateData[key] = value;
        }
    });

    updateData = toSnakeCase(updateData)
    updateData = jsonToString(updateData)
    console.log(updateData)

    let querySelector = `SELECT *, QUIZ_RESULT.ID AS recordId,
    get_quiz_result_rank(quiz_result.id) as rank, 
    quiz_category.name as quiz_category, 
    quiz_difficulty.name as quiz_difficulty 
    FROM QUIZ_RESULT 
    JOIN QUIZ ON QUIZ.ID = QUIZ_RESULT.QUIZ_ID 
    JOIN USERS ON USERS.ID = QUIZ.CREATOR 
    JOIN QUIZ_CATEGORY ON QUIZ_CATEGORY.ID = QUIZ.CATEGORY
    JOIN QUIZ_DIFFICULTY ON  QUIZ_DIFFICULTY.ID = QUIZ.DIFFICULTY
	WHERE ` + updateData

    let {rows} = await pool.query(querySelector)

    res.send({success: true, data: toCamelCase(rows)})
})
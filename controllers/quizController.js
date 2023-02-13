const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const toSnakeCase = require("../utils/toSnakeCase")
const jsonToString = require("../utils/jsonToString")
const pool = require("../utils/db")


exports.createQuiz = catchAsync(async(req, res, next) => {

    let {category, difficulty, quizType, expectedParticipants} = req.body

    let quizStatus = true

    if(quizType === "single")quizStatus = (quizType === 'single' && expectedParticipants != 1)

    let userId = req.user.id

    let {rows} = await pool.query(`
        insert into quiz (creator, category, difficulty, quiz_type, expected_participants)
        values($1, $2, $3, $4, $5) returning *
    `, [userId, category, difficulty, quizType, expectedParticipants]
    )

    let result = await pool.query(`
        select *, quiz.id as quizId, quiz_category.name as quizCategory, quiz_difficulty.name as quizDifficulty from quiz
        join quiz_category on quiz_category.id = quiz.category
        join quiz_difficulty on quiz_difficulty.id = quiz.difficulty
        where quiz.id = $1
    `, [rows[0].id])

    res.send({success: true, data: toCamelCase(result.rows)[0]})
})

exports.getByUserId = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from quiz where creator = $1
    `, [req.user.id])

    res.send({success: true, data: toCamelCase(rows)})
})

exports.getAll = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from quiz
    `)

    res.send({success: true, data: toCamelCase(rows)})
})

exports.getById = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select *, quiz.id as quizId, quiz_category.name as quizCategory, quiz_difficulty.name as quizDifficulty from quiz
        join quiz_category on quiz_category.id = quiz.category
        join quiz_difficulty on quiz_difficulty.id = quiz.difficulty
        where quiz.id = $1
    `, [req.params.id])

    res.send({success: true, data: toCamelCase(rows)[0]})
})


exports.updateQuizById = catchAsync(async(req, res, next) => {

    let data = req.body;
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value != "") {
        updateData[key] = value;
        }
    });

    updateData = toSnakeCase(updateData)

    await pool.query(`
        SELECT update_quiz_by_id_v2($1, $2);
    `, [req.params.id, updateData])

    let {rows} = await pool.query(`
        select * from quiz where id=$1
    `, [req.params.id])

    console.log(rows)

    res.send({success: true, data: toCamelCase(rows)[0]})
})

exports.deletById = catchAsync(async(req, res, next) => {
    await pool.query(`
        delete from quiz where id = $1
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
    
    let querySelector = 'select * from quiz where '+updateData

    let {rows} = await pool.query(querySelector)

    res.send({success: true, data: toCamelCase(rows)})

})

exports.joinQuiz = catchAsync(async(req, res, next) => {
    let {quizId} = req.body

    let id = quizId.split("-").slice(-1)[0];
    
    let {rows} = await pool.query(`
        SELECT * from quiz
        where id = $1 and started = false
    `, [id])

    if(!rows.length){
        return next(new AppError("Quiz has already started or quiz does not exist", 400))
    }

    console.log(rows[0].creator, req.user.id)

    if(rows[0].creator === req.user.id){
        return next(new AppError("You Cannot Join Your Own Quiz"))
    }

    if(rows[0].connected < rows[0].expected_participants){
        await pool.query(`
            UPDATE quiz set connected = connected+1 where id = $1
        `, [rows[0].id])
        return res.send({success: true, message: "quiz updated", data: toCamelCase(rows)[0]})
    }else{
        return next(new AppError("Quiz is full", 400))
    }
})
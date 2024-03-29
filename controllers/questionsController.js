const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const toSnakeCase = require("../utils/toSnakeCase")
const jsonToString = require("../utils/jsonToString")
const pool = require("../utils/db")
const { Configuration, OpenAIApi } = require("openai");

exports.getQuestions = catchAsync(async(req, res, next) => {

    let {difficultyId, categoryId, quizId, timer} = req.body

    let category = await pool.query(`
        select * from quiz_category where id = $1
    `, [categoryId])

    category = category.rows[0].name

    let difficulty = await pool.query(`
        select * from quiz_difficulty where id=$1
    `, [difficultyId])

    difficulty = difficulty.rows[0].name

    console.log(category, difficulty)

    try {
        const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        });

        const openai = new OpenAIApi(configuration);
    
        const response = await openai.createCompletion({
    
            model: "text-davinci-003",
            prompt: `I want 10 random ${difficulty} quiz questions under the ${category} category with their answers. The response should be in this format n[{"question": "question goes here", "a": "option a goes here", "b": "option b goe here", "c": "option c goes here", "d": "option d goes here", "answer": "c"}, {question: "question goes here", a: "option a goes here", "b": "option b goe here", "c": "option c goes here", "d": "option d goes here", "answer": "a"}]`,
            temperature: 0.7,
            max_tokens: 3064,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        let questions = response.data.choices[0].text

        
        let {rows} = await pool.query(`
        insert into questions(category, difficulty, questions)
        values($1, $2, $3) returning id, questions
        `, [categoryId, difficultyId, questions])
        
        await pool.query(`
            update quiz set questions_id = $1, timer = $2 where id = $3
        `, [rows[0].id, timer, quizId])
        
        rows[0].questions = rows[0].questions.replace(/^[^\[\]]+|[^\[\]]+$/g, "");
        rows[0].questions = JSON.parse(rows[0].questions)


        res.send({success: true, data: rows[0]})
        
        
    } catch (error) {


        let {rows} = await pool.query(`
            select id, questions from questions where category = $1 and difficulty = $2
        `, [categoryId, difficultyId])

        let randomNumber = generateRandomNumber(rows.length)
        try {
            rows[randomNumber].questions = JSON.parse(rows[randomNumber].questions)

            await pool.query(`
                update quiz set questions_id = $1, timer = $2 where id = $3
            `, [rows[randomNumber].id, timer, quizId])

            
            res.send({success: true, data: rows[randomNumber]})
            
        } catch (error) {
            rows[0].questions = rows[0].questions.replace(/^[^\[\]]+|[^\[\]]+$/g, "");
            rows[0].questions = JSON.parse(rows[0].questions)
            res.send({success: true, data: rows[0]})
        }


    }


})


function generateRandomNumber(n) {
    return Math.floor(Math.random() * n);
  }

exports.getAQuestion = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from questions where id = $1
    `, [req.params.id])

    rows[0].questions = JSON.parse(rows[0].questions)

    res.send({success: true, data: rows[0]})
})
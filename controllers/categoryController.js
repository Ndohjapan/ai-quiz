const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const toSnakeCase = require("../utils/toSnakeCase")
const jsonToString = require("../utils/jsonToString")
const pool = require("../utils/db")

exports.createCategory = catchAsync(async(req, res, next) => {
    let {name} = req.body

    let {rows} = await pool.query(`
        insert into quiz_category(name)
        values($1) returning *
    `, [name])

    res.send({success: true, data: toCamelCase(rows)[0]})

})

exports.getAllCategories = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from quiz_category
    `)

    res.send({success: true, data: toCamelCase(rows)})

})

exports.getCategory = catchAsync(async(req, res, next) => {
    let userId = req.params.id

    let {rows} = await pool.query(`
        select * from quiz_category where id = $1
    `, [userId])

    res.send({success: true, data: toCamelCase(rows)[0]})
})

exports.deleteCategory = catchAsync(async(req, res, next) => {
    await pool.query(`
        delete from quiz_category where id = $1
    `, [req.params.id])

    res.status(204).send({success: true, message: "Deleted Successfully"})
})

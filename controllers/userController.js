const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const toSnakeCase = require("../utils/toSnakeCase")
const jsonToString = require("../utils/jsonToString")
const pool = require("../utils/db")

exports.getUser = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from users where id = $1
    `, [req.params.id])

    res.send({success: true, data: toCamelCase(rows)[0]}) 
})

exports.getAllUsers = catchAsync(async(req, res, next) => {
    let {rows} = await pool.query(`
        select * from users
    `)

    res.send({success: true, data: toCamelCase(rows)}) 
})

exports.updateUser = catchAsync(async(req, res, next) => {

    let data = req.body;
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value != "") {
        updateData[key] = value;
        }
    });

    updateData = toSnakeCase(updateData)

    await pool.query(`
        SELECT update_user_by_id($1, $2);
    `, [req.params.id, updateData])

    let {rows} = await pool.query(`
        select * from users where id=$1
    `, [req.params.id])

    console.log(rows)

    res.send({success: true, data: toCamelCase(rows)[0]})
})

exports.deleteUser = catchAsync(async(req, res, next) => {
    await pool.query(`
        delete from users where id = $1
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
    
    let {rows} = await pool.query(`
        SELECT * FROM get_users_rows_by_string($1);
    `, [updateData])

    res.send({success: true, data: toCamelCase(rows)})
})
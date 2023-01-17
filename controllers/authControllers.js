const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const dates = require("../utils/dates")
const {sendMail} = require("../utils/sendMail")
const generateOtp = require("../utils/generateOtp")
const pool = require("../utils/db")
const bcrypt = require("bcrypt");


exports.signup = catchAsync(async(req, res, next) => {
    const {firstname, lastname, username, email, password} = req.body

    const otp = generateOtp();
    const otpExpiresIn = dates.getFutureMinutes(process.env.OTP_MINUTES_LIMIT); 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        
        let {rows} = await pool.query(`
            insert into users (firstname, lastname, username, email, password, otp, otp_expires_in)
            values($1, $2, $3, $4, $5, $6, $7) returning *
        `, [firstname, lastname, username, email, hashedPassword, otp, otpExpiresIn]
        )
        // await sendMail(email, otp);

        console.log(process.env.NODE_ENV)
        
        if(process.env.NODE_ENV === "development"){
            return res.send({success: true, message: "OTP Sent to your email", data: toCamelCase(rows)[0]})
        }
    
        return res.send({success: true, message: "OTP Sent to your email"})
    }
    catch(err){
        return next(new AppError(err.message, 400))
    }


})


exports.verifyOTP = catchAsync(async(req, res, next) => {
    const { otp, email } = req.body;

    const {rows} = await pool.query(`
        select * from users where email=$1 and otp=$2
    `, [email, otp])

    console.log(rows)

    if (!rows.length) return next(new AppError("Invalid OTP", 400));

    
    const currentDate = Date.now();
    const elapsed = dates.minuteDifference(currentDate, rows[0].otp_expires_in);
    
    if (elapsed > process.env.OTP_MINUTES_LIMIT){
        return next(new AppError("OTP expired", 400));
    }else{
        
        let {rows} = await pool.query(`
            update users set VERIFIED = true, otp='' where email = $1 returning *
        `, [email])
        
        return res.send({success: true, data: toCamelCase(rows)[0]})

    }
})

exports.resendOTP 

exports.login

exports.resetPassword
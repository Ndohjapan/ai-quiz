const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const toCamelCase = require("../utils/toCamelCase")
const dates = require("../utils/dates")
const {sendMail} = require("../utils/sendMail")
const generateOtp = require("../utils/generateOtp")
const pool = require("../utils/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


async function signJWT (email, verified){
    return jwt.sign(
        { email: email, verified: verified, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) },
        process.env.JWT_PRIVATE_KEY
    );
}


exports.signup = catchAsync(async(req, res, next) => {
    const {firstname, lastname, username, email, password} = req.body

    const otp = generateOtp();
    const otpExpiresIn = dates.getFutureMinutes(process.env.OTP_MINUTES_LIMIT); 

    const {rows} = await pool.query(`
        SELECT hash_password($1);
    `, [password])

    const hashedPassword = rows[0].hash_password

    try{
        
        let {rows} = await pool.query(`
            insert into users (firstname, lastname, username, email, password, otp, otp_expires_in)
            values($1, $2, $3, $4, $5, $6, $7) returning *
        `, [firstname, lastname, username, email, hashedPassword, otp, otpExpiresIn]
        )
        // await sendMail(email, otp);
        
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

exports.resendOTP = catchAsync(async(req, res, next) => {
    let {email} = req.body

    const otp = generateOtp();
    const otpExpiresIn = dates.getFutureMinutes(process.env.OTP_MINUTES_LIMIT); 

   let {rows} = await pool.query(`
        update users set otp = $1, otp_expires_in=$2 where email = $3 returning *
    `, [otp, otpExpiresIn, email])
    // await sendMail(email, otp);

    if(process.env.NODE_ENV === "development"){
        return res.send({success: true, message: "OTP Sent to your email", data: toCamelCase(rows)[0]})
    }

    return res.status(200).json({ success: true, data: "OTP re-sent" });
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password)
        return next(new AppError("Provide an email and password", 400));
  
    let user = await pool.query(`
        select * from users where email = $1
    `, [email])


    if (!user.rows.length){
      return next(new AppError("User not found", 404));
    }
    else{

        const {rows} = await pool.query(`
            SELECT check_password($1, $2)
        `, [password, email])

        const correctPassword = rows[0].check_password
        if (!correctPassword){
    
            return next(new AppError("Incorrect email or password", 400));
        }else{
            const token = await signJWT(email, rows[0].verified);
            res.status(200).json({ success: true, token, data: toCamelCase(user.rows)[0] });
        }
  
    } 
  
  })

exports.resetPassword = catchAsync(async(req, res, next) => {
    let {email, newPassword} = req.body
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
  
    let {rows} = await pool.query(`
            update users set VERIFIED = true, password=$1 where email = $2 returning *
        `, [hashedPassword, email])
  
    res.status(200).send({status: true, message: "Password Set Successfully"})

})
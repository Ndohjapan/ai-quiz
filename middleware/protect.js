const ExpressBrute = require("express-brute");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")
const pool = require("../utils/db")
const toCamelCase = require("../utils/toCamelCase")
const jwt = require("jsonwebtoken")

// using memory store, an in-memory db is recommended for production
let store = new ExpressBrute.MemoryStore();
exports.bruteForce = new ExpressBrute(store);

// exports.permissionTo = (...roles) => {
//     return catchAsync((req, res, next) => {
//       if(req.user.role === "bursar"){
//         next()
//       }
//       else{
//         let userPermissions = req.user.permissions
//         let permission = userPermissions.join().includes(roles.join())
//         if (!permission)
//           return next(
//             new AppError("You do not have permission to perform this action", 403)
//           );
//         next();
//       }
//     });
//   };
  
exports.protect = catchAsync(async (req, res, next) => {
    let token = req.header("x-auth-token");
    if(!token){
        return next(new AppError("Invalid Token", 403))
    }

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)

    let {rows} = await pool.query(`
        select * from users where id = $1
    `, [decoded.id])

    req.user = toCamelCase(rows)[0]

    if(!req.user){
        return next(new AppError("Invalid Token", 403))
    }
    
    next()
});
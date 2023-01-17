const ExpressBrute = require("express-brute")
const catchAsync = require("../utils/catchAsync")

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
  
//   exports.protect = catchAsync(async (req, res, next) => {
//     let token = req.header("x-auth-token");
//     if(!token){
//       return res.status(401).send({success: false, message: "Invalid Token"})
//     }
    
//     try{
//       const decoded = jwt.verify(token, process.env.jwtPrivateKey)
//       req.user = await userSchema.findById(decoded.id);
//       if(req.user){
//         return next()
//       }
//       else{
//         req.user = await adminSchema.findById(decoded.id)
//         req.user = req.user ? req.user : await restaurantSchema.findById(decoded.id)
//         return next()
//       }
//     }
//     catch(err){
//       return res.status(401).send({success: false, message: "Invalid Token"})
//     }
//   });
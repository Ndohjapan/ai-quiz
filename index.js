const app = require("./app")
const pool = require("./utils/db")
const dotenv = require("dotenv")
const socketio = require("socket.io")
dotenv.config()

const PORT = process.env.port || 3030

pool.connect({
    host: process.env.HOST,
    port: process.env.POSTGRESS_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD 
}).then(() => {
    console.log("connected to db")
    let server = app.listen(PORT, () => {
        console.log("Server is runnning on Port "+PORT)
    })

    const io = socketio(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST", "PUT", "DELETE", "PURGE"]
        }
    })

}).catch(err => {
    console.error(err)
})



const app = require("./app")
const {prototype} = require("./utils/db")
const dotenv = require("dotenv")
dotenv.config()

const PORT = process.env.port || 3030

prototype.connect({
    host: process.env.HOST,
    port: process.env.POSTGRESS_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD 
}).then(() => {
    console.log("connected to db")
    app.listen(PORT, () => {
        console.log("Server is runnning on Port "+PORT)
    })
}).catch(err => {
    console.error(err)
})


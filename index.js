const app = require("./app")
const pool = require("./utils/db")
const dotenv = require("dotenv")
const socketio = require("socket.io")
dotenv.config()

const PORT = process.env.port || 3030

let groupInfo = {}

pool.connect({
    host: process.env.HOST,
    port: process.env.POSTGRESS_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD 
}).then(() => {
    console.log("connected to db")
}).catch(err => {
    console.error(err)
})


let server = app.listen(PORT, () => {
    console.log("Server is runnning on Port "+PORT)
})

const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PURGE"]
    }
})

io.on('connection', (socket) => {
    console.log("Someone connected: ", socket.id)
    socket.on('createGroup', (group) => {
        console.log("I want to create a group", group)
        socket.join(group.name);

        groupInfo[group.name] = [{id: group.id, username: group.username}]

        console.log("This is the current state of the group info", groupInfo)
        
    });
    
    socket.on("joinGroup", (group) => {
        console.log("I want to join the group")
        console.log(group)
        socket.join(group.name)

        console.log("This is the current state of the group info", groupInfo)
        
        groupInfo[group.name].push({id: group.id, username: group.username})

        io.to(group.name).emit('groupMessage', groupInfo[group.name]);

    })
});


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



io.on('connection', async(socket) => {
    console.log("Someone connected: ", socket.id)
    socket.on('createGroup', async(group) => {
        socket.join(group.name);

        groupInfo[group.name] = [{id: group.id, username: group.username}]

        const detach = await io.in(group.name).fetchSockets();

    });
    
    socket.on("joinGroup", async(group) => {
        socket.join(group.name)
        
        try{

            groupInfo[group.name].push({id: group.id, username: group.username})

            io.to(group.name).emit('groupMessage', groupInfo[group.name]);
            
            console.log(io.in(group.name).allSockets())
            
        }
        catch(err){
            console.log(err)
        }


    })

    socket.on("startQuiz", (groupName) => {
        console.log("I am here")
        io.to(groupName).emit('startQuizBtn');
    })
});


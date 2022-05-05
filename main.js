const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const errorMiddleware = require("./middlewares/errorMiddleware")
const {joinUser, getCurrentUser, disconnectClient, addModerMessageToDB, addClientMessageToDB} = require("./sockets/services/chatService")
const chatsRouter = require("./routes/chatsRouter")

const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: process.env.CLIENT_URL
    }
})

app.use(express.json())
app.use(cors({
    credentials: true,
    methods: ["POST", "GET"],
    origin: [process.env.CLIENT_URL],
    allowedHeaders: ['Content-Type']
}))

app.use('/chats', chatsRouter)

app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)

        server.listen(process.env.PORT, () => {
            console.log(`Server started on PORT = ${process.env.PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

io.on("connection", (socket) => {
    let joinedModerRoom = '';

    socket.on("joinModer", ({ email }) => {
        socket.join(email)
        joinedModerRoom = email
    });
    socket.on("joinClient", ({ userInfo }) => {
        const {currentUser} = joinUser(socket.id, userInfo);
        socket.join(currentUser.userInfo.email);
    });

    socket.on("chatModer", ({ text }) => {
        addModerMessageToDB(joinedModerRoom, text)

        io.to(joinedModerRoom).emit("message", {
            username: 'Поддержка',
            text
        });
    });
    socket.on("chatClient", async ({text}) => {
        const user = getCurrentUser(socket.id);

        if (user) {
            const newChat = await addClientMessageToDB(user.userInfo, text)
            if (newChat !== undefined) {
                io.emit("newChat", newChat)
            } else {
                io.to(user.userInfo.email).emit("message", {
                    username: user.userInfo.firstname + ' ' + user.userInfo.lastname,
                    text
                });
            }
        }

    });

    socket.on("disconnect", () => {
        disconnectClient(socket.id);
    });
});

start()

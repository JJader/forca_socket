const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

let users = [];
const messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: []
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join server', (username) => {
        const user = {
            username,
            id: socket.id
        }
        users.push(user);
        io.emit("new user", users);
    });

    socket.on('join room', (roomName, cb) => {
        socket.join(roomName);
        cb(messages[roomName]);
    });

    socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
        if (isChannel) {
            const payload = {
                content,
                chatName,
                sender
            };
            socket.to(to).emit("new message", payload);
        }
        else {
            const payload = {
                content,
                chatName: sender,
                sender
            };
            socket.to(to).emit("new message", payload);
        }

        if (messages[chatName]) {
            messages[chatName].push({
                sender,
                content
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users = users.filter(u => u.id !== socket.id);
        io.emit("new user", users);
    });

});

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });


// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       io.emit('chat message', msg);
//       console.log('message: ' + msg);
//     });
//   });

server.listen(3000, () => {
    console.log('listening on *:3000');
});



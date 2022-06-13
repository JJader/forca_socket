const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const { userJoin, getCurrentUser, removeCurrentUser } = require('./user');
const formatMessage = require('./message');

const PORT = 3000 || process.env.PORT;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // socket.on('joinRoom', ({ userName, room }) => {
    //     const user = userJoin(socket.id ,userName, room);
    //     socket.join(user.room);

    //     socket.on('chat message', (msg) => {
    //         io.emit('chat message', msg);
    //         console.log('message: ' + msg);
    //     });

    //     socket.emit('chat message', 'Welcome !!');
    // })

    socket.on('joinServer', (username) => {
        userJoin(
            socket.id,
            username,
            ''
        );

        console.log(username + ' connected');

        socket.emit('chat message', formatMessage('', 'Bem vindo !!'));
        socket.broadcast.emit('chat message', formatMessage('', username + ' entrou no chat'));
    });

    socket.on('chat message', (user, msg) => {
        io.emit('chat message', formatMessage(user, msg));
        console.log(user + ' : ' + msg);
    });

    socket.on('disconnect', () => {
        var user = removeCurrentUser(socket.id)
        console.log(user.userName + ' disconnected');
        socket.broadcast.emit('chat message', formatMessage('', user.userName + ' saiu do chat'));
    });
});

server.listen(PORT, () => {
    console.log("listening on: " + PORT);
});



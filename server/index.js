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
    socket.on('join_room', (username, room) => {
        userJoin(
            socket.id,
            username,
            room
        );

        socket.join(room);
        socket.emit('receive_message', formatMessage('', 'Bem vindo !!'));
        socket.to(room).emit('receive_message',formatMessage('', username + ' entrou no jogo'));

        console.log(username + ' connected');
    });

    socket.on('send_message', (room, user, msg) => {
        socket.to(room).emit('receive_message', formatMessage(user, msg));
        console.log(user + ' : ' + msg);
    });

    socket.on('alert', (user, msg) => {
        io.emit('receive_message', formatMessage(user, msg));
        console.log(user + ' : ' + msg);
    });

    socket.on('disconnect', () => {
        var user = removeCurrentUser(socket.id)
        socket.to(user.room).emit(
            'receive_message',
            formatMessage('', user.userName + ' saiu do chat')
        );

        console.log(user.userName + ' disconnected');
    });
});

server.listen(PORT, () => {
    console.log("listening on: " + PORT);
});



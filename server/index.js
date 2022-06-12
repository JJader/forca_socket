const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const PORT = 3000 || process.env.PORT;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
});

server.listen(PORT, () => {
    console.log('listening on *:3000');
});



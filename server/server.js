const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const port = 3000;

let waiting_User = [];


const partners = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    waiting_User.push(socket);

    if (waiting_User.length >= 2) {
        const user1 = waiting_User.shift();
        const user2 = waiting_User.shift();

        partners.set(user1.id, user2.id);
        partners.set(user2.id, user1.id);

        user1.emit('paired', { partnerId: user2.id });
        user2.emit('paired', { partnerId: user1.id });
    }

    socket.on('offer', (data) => {
        io.to(data.target).emit('offer', { sdp: data.sdp, from: socket.id });
    });

    socket.on('answer', (data) => {
        io.to(data.target).emit('answer', { sdp: data.sdp, from: socket.id });
    });

    socket.on('candidate', (data) => {
        io.to(data.target).emit('candidate', { candidate: data.candidate, from: socket.id });
    });

    socket.on('send-message', (data) => {
        const { message, target } = data;
        io.to(target).emit('receive-message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        waiting_User = waiting_User.filter((user) => user.id !== socket.id);

        const partnerId = partners.get(socket.id);
        if (partnerId) {
            partners.delete(partnerId);
            partners.delete(socket.id);
            io.to(partnerId).emit('partner-disconnected');
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

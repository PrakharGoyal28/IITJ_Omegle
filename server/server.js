const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const dotenv=require('dotenv')
dotenv.config()
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const io = new Server(server, { cors: { origin: '*' } });
//const socket = io("http://localhost:<PORT>");

let waitingUsers = [];
const partners = new Map();
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Add the user to the waiting queue
    waitingUsers.push(socket);

    // Pair users if there are at least two waiting
    if (waitingUsers.length >= 2) {
        const user1 = waitingUsers.shift();
        const user2 = waitingUsers.shift();

        partners.set(user1.id, user2.id);
        partners.set(user2.id, user1.id);

        user1.emit('paired', { partnerId: user2.id });
        user2.emit('paired', { partnerId: user1.id });
        console.log(`waitingusers : `, waitingUsers.length)
    }

    // Handle WebRTC offer
    socket.on('offer', (data) => {
        const { target, sdp } = data;
        io.to(target).emit('offer', { sdp, from: socket.id });
        console.log(`data1`, target)
    });

    // Handle WebRTC answer
    socket.on('answer', (data) => {
        const { target, sdp } = data;
        io.to(target).emit('answer', { sdp, from: socket.id });
    });

    // Handle ICE candidates
    socket.on('candidate', (data) => {
        const { target, candidate } = data;
        io.to(target).emit('candidate', { candidate, from: socket.id });
        console.log(`target`, target)
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
        const { message, target } = data;
        io.to(target).emit('receive-message', message);
        console.log(`message`, message)
    });

    // Handle stream sharing (if applicable)
    socket.on('send-stream', (data) => {
        const { streamId } = data;
        const partnerId = partners.get(socket.id);
        console.log(`streamid`, streamId)
        console.log(`partnedid`, partnerId)
        if (partnerId) {
            io.to(partnerId).emit('receive-stream', { streamId });
        }
    });

    // Handle skipping user
    socket.on('skip-user', () => {
        console.log('User skipped:', socket.id);
        const partnerId = partners.get(socket.id);

        if (partnerId) {
            io.to(partnerId).emit('partner-disconnected');
            partners.delete(partnerId);
            partners.delete(socket.id);
        }

        waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);
        waitingUsers.push(socket); // Add back to waiting queue for pairing

        if (waitingUsers.length >= 2) {
            const user1 = waitingUsers.shift();
            const user2 = waitingUsers.shift();

            partners.set(user1.id, user2.id);
            partners.set(user2.id, user1.id);

            user1.emit('paired', { partnerId: user2.id });
            user2.emit('paired', { partnerId: user1.id });
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);

        const partnerId = partners.get(socket.id);
        if (partnerId) {
            partners.delete(partnerId);
            partners.delete(socket.id);
            io.to(partnerId).emit('partner-disconnected');
        }
        else{
            waitingUsers.forEach(userSocket=>{
                userSocket.emit('partner-disconnected');
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

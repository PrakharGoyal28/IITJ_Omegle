const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt=require('bcrypt');
const {Server}=require('socket.io');
const http=require('http');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

let waiting_User=[];



io.on('connection',(socket)=>{
    console.log('user is connected',socket.id);
    waiting_User.push(socket);

    if(waiting_User>=2){
        const user1=waiting_User.shift();
        const user2=waiting_User.shift();

        user1.emit('paired',{partnerId:user2.id});
        user2.emit('paired',{partnerId:user1.id});
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
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);
        });
        
    
    
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

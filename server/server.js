const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

mongoose.connect(
    'mongodb+srv://prakhar28goyal:prakhargoyalgoyal@cluster0.sw5dm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const new_User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', new_User);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

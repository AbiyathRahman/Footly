require('dotenv').config();
const db = require('./db/conn');
const express = require('express');
const home = require('./routes/home');
const competition = require('./routes/competition');
const team = require('./routes/team');
const player = require('./routes/player');
const match = require('./routes/match');
const auth = require('./auth/auth');


const server = express();
server.use(express.json());

const port = process.env.PORT;

server.use('/', home);
server.use('/api', competition);
server.use('/api', team);
server.use('/api', player);
server.use('/api', match);
server.use('/api/auth', auth);

// Connect to database before starting server
db.connectToServer((err) => {
    if (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }

    server.listen(port, () => {
        console.log(`✓ Server is running on port ${port}`);
        console.log(`✓ Database connection established`);
    });
});

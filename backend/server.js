require('dotenv').config();
const express = require('express');
const home = require('./home');
const competition = require('./competition');
const team = require('./team');
const player = require('./player');
const match = require('./match');


const server = express();
server.use(express.json());

const port = process.env.PORT;

server.use('/', home);
server.use('/api', competition);
server.use('/api', team);
server.use('/api', player);
server.use('/api', match);


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

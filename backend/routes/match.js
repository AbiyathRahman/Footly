const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to get a match for a team

router.get('/matches/PD/Barcelona', async (req, res) => {
    try {
        const response = await axios.get('http://api.football-data.org/v4/teams/81/matches', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        const wins = response.data.resultSet.wins;
        const losses = response.data.resultSet.losses;
        const draws = response.data.resultSet.draws;
        res.json({ wins, losses, draws });
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ error: 'Failed to fetch match data' });
    }


});

module.exports = router;    
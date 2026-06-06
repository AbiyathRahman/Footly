const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to get a specific team data

router.get('/teams/PD/Barcelona', async (req, res) => {
    try {
        const response = await axios.get('http://api.football-data.org/v4/teams/81', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        const name = response.data.name;
        const coach = response.data.coach.name;
        const players = response.data.squad.map(player => player.name);
        res.json({ name, coach, players });
    } catch (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
});

module.exports = router;
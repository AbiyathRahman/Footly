const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to fetch a specific player

router.get('/players/LamineYamal', async (req, res) => {
    try {
        const response = await axios.get('http://api.football-data.org/v4/persons/202283', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching player data:', error);
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
});

module.exports = router;
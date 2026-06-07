const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to get a specific team data

router.get('/teams/:name', async (req, res) => {
    try {
        const response = await axios.get(`https://v3.football.api-sports.io/teams?name=${req.params.name}`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            },

        });
        res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
});

module.exports = router;
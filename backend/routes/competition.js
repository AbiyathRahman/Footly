const axios = require('axios');
const express = require('express');
const router = express.Router();

// Route to fetch competition data

router.get('/leagues', async (req, res) => {
    try {
        const response = await axios.get('https://v3.football.api-sports.io/leagues', {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            },

        });
        leagues = response.data.response.map(league => league.league.name);
        res.json({ leagues });

    } catch (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
});

// Route to get a specific competetion by country
router.get('/leagues/:country', async (req, res) => {
    try {
        const response = await axios.get(`https://v3.football.api-sports.io/leagues?country=${req.params.country}`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        leagues = response.data.response.map(league => league.league.name);
        res.json({ leagues });
    } catch (error) {
        console.error('Error fetching competition:', error);
        res.status(500).json({ error: 'Failed to fetch competition' });
    }
});

// Route to get a specific competition by name
router.get('/leagues/name/:name', async (req, res) => {
    try {
        const response = await axios.get(`https://v3.football.api-sports.io/leagues?name=${req.params.name}`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        leagueID = response.data.response.map(league => league.league.id);
        leagues = response.data.response.map(league => league.league.name);
        seasons = response.data.response.map(league => league.seasons.map(season => season.year)).flat();
        res.json({ leagueID, leagues, seasons });
    } catch (error) {
        console.error('Error fetching competition:', error);
        res.status(500).json({ error: 'Failed to fetch competition' });
    }
});

module.exports = router;
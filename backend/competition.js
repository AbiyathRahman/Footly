const axios = require('axios');
const express = require('express');
const router = express.Router();

// Route to fetch competition data

router.get('/competitions', async (req, res) => {
    try {
        const response = await axios.get('http://api.football-data.org/v4/competitions', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        const count = response.data.count;
        const names = response.data.competitions.map(competition => competition.name);
        const codes = response.data.competitions.map(competition => competition.code);
        res.json({ count, names, codes });
    } catch (error) {
        console.error('Error fetching competitions:', error);
        res.status(500).json({ error: 'Failed to fetch competitions' });
    }

});

// Route to get a specific competetion by code
router.get('/competitions/PD', async (req, res) => {
    try {
        const response = await axios.get('http://api.football-data.org/v4/competitions/PD/teams', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        //const teams = response.data.teams.map(team => team.name);
        res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching competition:', error);
        res.status(500).json({ error: 'Failed to fetch competition' });
    }
});

module.exports = router;
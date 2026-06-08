const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db/conn');

// Route to get a match for a team

router.get('/matches/:name', async (req, res) => {
    try {
        const leagueName = req.params.name;
        const leagueInDb = await db.getDb().collection('leagues').findOne({ name: leagueName });
        let leagueID;
        if (!leagueInDb) {
            const leagueResponse = await axios.get(`https://v3.football.api-sports.io/leagues?name=${req.params.name}`, {
                headers: {
                    'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
                }
            });
            leagueID = leagueResponse.data.response.map(league => league.league.id);
            await db.getDb().collection('leagues').insertOne({ name: leagueName, leagueID: leagueID });

        } else {
            leagueID = leagueInDb.leagueID;
        }


        const response = await axios.get(`https://v3.football.api-sports.io/fixtures?league=${leagueID}&season=2024`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            }
        });

        res.json({ response: response.data });
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ error: 'Failed to fetch match data' });
    }


});

module.exports = router;    
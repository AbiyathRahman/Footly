const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db/conn');

// Route to get matches for a league
router.get('/matches/:name', async (req, res) => {
    try {
        // Check if league exists in the database or get league id from the API and store it in the database for future use
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

        // Fetch matches for the league
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

// Get matches for a specific team
router.get('/matches/team/:name', async (req, res) => {
    try {
        const teamName = req.params.name;
        const existingTeam = await db.getDb().collection('teams').findOne({ name: teamName });
        let teamId;
        if (!existingTeam) {
            const teamResponse = await axios.get(`https://v3.football.api-sports.io/teams?search=${teamName}`, {
                headers: {
                    'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
                }
            });
            teamId = teamResponse.data.response[0].team.id;
            await db.getDb().collection('teams').insertOne({ name: teamName, teamId: teamId });

        }
        else {
            teamId = existingTeam.teamId;
        }

        const matchesResponse = await axios.get(`https://v3.football.api-sports.io/fixtures?team=${teamId}&season=2024`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            }
        });

        const matches = matchesResponse.data.response.map(match => ({
            fixtureId: match.fixture.id,
            date: match.fixture.date,
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            score: match.teams.home.name + ' - ' + match.score.fulltime.home + ' : ' + match.score.fulltime.away + ' - ' + match.teams.away.name,
        }));
        res.json({ response: matches });
    } catch (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
});

module.exports = router;    
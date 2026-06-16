const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db/conn');

// Route to get a specific team data

router.get('/teams/:name', async (req, res) => {
    try {
        const teamName = req.params.name;
        const teamInDb = await db.getDb().collection('teams').findOne({ name: teamName });
        if (!teamInDb) {
            const teamResponse = await axios.get(`https://v3.football.api-sports.io/teams?search=${teamName}`, {
                headers: {
                    'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
                }
            });
            const teamData = teamResponse.data.response;
            await db.getDb().collection('teams').insertOne({ name: teamName, teamId: teamData[0].team.id });
            //const teamLeague = 
            res.json({ teamData });
        } else {
            res.json({ teamData: teamInDb });
        }

    } catch (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
});

// Get all teams in a league
router.get('/teams/league/:name', async (req, res) => {
    try {
        const leagueInDb = await db.getDb().collection('leagues').findOne({ name: req.params.name });
        let leagueID;
        let teams;
        if (!leagueInDb) {
            const leagueResponse = await axios.get(`https://v3.football.api-sports.io/leagues?name=${req.params.name}`, {
                headers: {
                    'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
                }
            });
            const leagueID = leagueResponse.data.response[0].league.id;
            await db.getDb().collection('leagues').insertOne({ name: req.params.name, leagueID: leagueID });
        } else {
            leagueID = leagueInDb.leagueID;
            teams = leagueInDb.teams;
        }

        const teamResponse = await axios.get(`https://v3.football.api-sports.io/teams?league=${leagueID}&season=2024`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        if (!teams) {
            const teams = teamResponse.data.response.map(team => team.team.name);
            await db.getDb().collection('leagues').updateOne({ name: req.params.name }, { $set: { teams: teams } });
        }
        res.json({ response: teams });
    } catch (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
});

// Get team and statistics for a specific team
router.get('/teams/statistics/:name', async (req, res) => {
    try {
        const teamName = req.params.name;
        const teamInDb = await db.getDb().collection('teams').findOne({ name: teamName });
        let teamId;
        if (!teamInDb) {
            const teamResponse = await axios.get(`https://v3.football.api-sports.io/teams?search=${teamName}`, {
                headers: {
                    'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
                }
            });
            teamId = teamResponse.data.response[0].team.id;
            await db.getDb().collection('teams').insertOne({ name: teamName, teamId: teamId, leagueID: teamResponse.data.response[0].team.league.id });
        } else {
            teamId = teamInDb.teamId;
        }
        const statisticResponse = await axios.get(`https://v3.football.api-sports.io/teams/statistics?league=140&team=${teamId}&season=2024`, {
            headers: {
                'x-apisports-key': process.env.FOOTBALL_DATA_API_KEY
            }
        });
        res.json({ response: statisticResponse.data });
    } catch (error) {
        console.error('Error fetching team statistics:', error);
        res.status(500).json({ error: 'Failed to fetch team statistics' });
    }
});

module.exports = router;
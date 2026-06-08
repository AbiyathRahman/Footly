const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/conn');
const secretKey = process.env.supersecretkey;
const { ObjectId } = require('mongodb');

// User registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usersCollection = db.getDb().collection('users');
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userCollection = db.getDb().collection('users');
        const user = await userCollection.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Get user info (protected route)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userCollection = db.getDb().collection('users');
        const user = await userCollection.findOne({ _id: new ObjectId(req.user.userId) }, { projection: { password: 0 } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


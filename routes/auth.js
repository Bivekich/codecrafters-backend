const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const createAuthRoutes = (db) => {
    const router = express.Router();
    const usersCollection = db.collection('users');

    router.post('/register',
        body('username').isLength({ min: 3 }),
        body('password').isLength({ min: 5 }),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, password } = req.body;
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Имя пользователя уже существует' });
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const user = { username, passwordHash, createdAt: new Date() };
            const result = await usersCollection.insertOne(user);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Пользователь успешно зарегистрировался', user: createdUser });
        }
    );

    router.post('/login',
        body('username').isLength({ min: 3 }),
        body('password').isLength({ min: 5 }),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, password } = req.body;
            const user = await usersCollection.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Неверные учетные данные' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Неверные учетные данные' });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        }
    );

    return router;
};

module.exports = createAuthRoutes;

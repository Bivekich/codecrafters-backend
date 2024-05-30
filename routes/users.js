const express = require('express');
const { ObjectId } = require('mongodb');
const {validationResult, body} = require("express-validator");
const bcrypt = require("bcryptjs");

const createUsersRoutes = (db) => {
    const router = express.Router();
    const usersCollection = db.collection('telegram_users');

    router.get('/', async (req, res) => {
        try {
            const users = await usersCollection.find().toArray();
            res.json(users);
        } catch (error) {
            res.status(500).send('Ошибка при получении пользователей');
        }
    });

    router.post('/', body('userId').isLength({ min: 1 }), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userId, data } = req.body;
        const existingUser = await usersCollection.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователя уже существует' });
        }
        const user = { userId, data: data ? data: null, createdAt: new Date() };
        const result = await usersCollection.insertOne(user);
        const createdUser = await usersCollection.findOne({ _id: result.insertedId });
        res.status(201).json({ message: 'Пользователь добавлен', user: createdUser });
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount > 0) {
                res.send(`Пользователь с идентификатором ${req.params.id} успешно удален`);
            } else {
                res.status(404).send('Пользователь не найден');
            }
        } catch (error) {
            res.status(500).send('Ошибка удаления пользователя');
        }
    });

    return router;
};

module.exports = createUsersRoutes;

const express = require('express');
const { ObjectId } = require('mongodb');

const createTechnologiesRoutes = (db) => {
    const router = express.Router();
    const commentsCollection = db.collection('comments');

    router.get('/', async (req, res) => {
        try {
            const contact = await commentsCollection.find().toArray();
            res.json(contact);
        } catch (error) {
            res.status(500).send('Ошибка при получении контактов.');
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { text, author, src } = req.body;
            const newData = { text, author, src };
            const result = await commentsCollection.insertOne(newData);
            res.status(201).send(`Комментарий ${result.insertedId} добавлен`);
        } catch (error) {
            res.status(500).send('Ошибка создания комментария');
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { text, author, src } = req.body;
            const updateData = { text, author, src };
            const result = await commentsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updateData }
            );
            if (result.matchedCount > 0) {
                res.send(`Комментарий с идентификатором ${req.params.id} успешно обновлен`);
            } else {
                res.status(404).send('Комментарий не найден');
            }
        } catch (error) {
            res.status(500).send('Ошибка обновления комментария');
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await commentsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount > 0) {
                res.send(`Комментарий ${req.params.id} успешно удален`);
            } else {
                res.status(404).send('Комментарий не найден');
            }
        } catch (error) {
            res.status(500).send('Ошибка при удалении комментария');
        }
    });

    return router;
};

module.exports = createTechnologiesRoutes;
const express = require('express');
const { ObjectId } = require('mongodb');

const createTechnologiesRoutes = (db) => {
    const router = express.Router();
    const contactCollection = db.collection('contact');

    router.get('/', async (req, res) => {
        try {
            const contact = await contactCollection.find().toArray();
            res.json(contact);
        } catch (error) {
            res.status(500).send('Ошибка при получении контактов.');
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title, text, button } = req.body;
            const newData = { title, text, button };
            const result = await contactCollection.insertOne(newData);
            res.status(201).send(`Информация ${result.insertedId} добавлена`);
        } catch (error) {
            res.status(500).send('Ошибка создания информации');
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { title, text, button } = req.body;
            const updateData = { title, text, button };
            const result = await contactCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updateData }
            );
            if (result.matchedCount > 0) {
                res.send(`Информация с идентификатором ${req.params.id} успешно обновлена`);
            } else {
                res.status(404).send('Информация не найдена');
            }
        } catch (error) {
            res.status(500).send('Ошибка обновления информации');
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await contactCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount > 0) {
                res.send(`Информация ${req.params.id} успешно удалена`);
            } else {
                res.status(404).send('Информация не найдена');
            }
        } catch (error) {
            res.status(500).send('Ошибка при удалении информации');
        }
    });

    return router;
};

module.exports = createTechnologiesRoutes;

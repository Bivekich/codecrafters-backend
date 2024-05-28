const express = require('express');
const { ObjectId } = require('mongodb');

const createTechnologiesRoutes = (db) => {
    const router = express.Router();
    const technologiesCollection = db.collection('technologies');

    router.get('/', async (req, res) => {
        try {
            const technologies = await technologiesCollection.find().toArray();
            res.json(technologies);
        } catch (error) {
            res.status(500).send('Ошибка при получении технологий');
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title, name, description, isMain, group } = req.body;
            const newTechnology = { title, name, description: isMain ? description: null, isMain, group: !isMain ? group: null };
            const result = await technologiesCollection.insertOne(newTechnology);
            res.status(201).send(`Технология с идентификатором ${result.insertedId} успешно создана`);
        } catch (error) {
            res.status(500).send('Ошибка создания технологии');
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { title, name, description, isMain, group} = req.body;
            const updateData = { title, name, description: isMain ? description: null, isMain, group: !isMain ? group: null };
            const result = await technologiesCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updateData }
            );
            if (result.matchedCount > 0) {
                res.send(`Технология с идентификатором ${req.params.id} успешно обновлена`);
            } else {
                res.status(404).send('Технология не найдена');
            }
        } catch (error) {
            res.status(500).send('Ошибка обновления технологии');
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await technologiesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount > 0) {
                res.send(`Технология с идентификатором ${req.params.id} успешно удалена`);
            } else {
                res.status(404).send('Технология не найдена');
            }
        } catch (error) {
            res.status(500).send('Ошибка удаления технологии');
        }
    });

    return router;
};

module.exports = createTechnologiesRoutes;

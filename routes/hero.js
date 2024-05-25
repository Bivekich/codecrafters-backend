const express = require('express');
const { ObjectId } = require('mongodb');

const createHeroesRoutes = (db) => {
    const router = express.Router();
    const heroesCollection = db.collection('heroes');

    router.get('/', (req, res) => {
        heroesCollection.find().toArray()
            .then(results => {
                res.json(results);
            })
            .catch(error => {
                res.status(500).send('Ошибка при получении записей Hero');
            });
    });

    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        heroesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, description } }
        )
            .then(result => {
                if (result.matchedCount > 0) {
                    res.send(`Запись Hero с id ${id} успешно обновлена`);
                } else {
                    res.status(404).send('Запись Hero не найдена');
                }
            })
            .catch(error => {
                res.status(500).send('Ошибка при обновлении записи Hero');
            });
    });

    return router;
};

module.exports = createHeroesRoutes;

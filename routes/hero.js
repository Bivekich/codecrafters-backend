const express = require('express');
const { ObjectId } = require('mongodb');

const createHeroesRoutes = (db) => {
    const router = express.Router();
    const heroesCollection = db.collection('hero');

    router.get('/', (req, res) => {
        heroesCollection.find().toArray()
            .then(results => {
                res.json(results);
            })
            .catch(() => {
                res.status(500).send('Ошибка получения баннера');
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
                    res.send(`Баннер с идентификатором ${id} успешно обновлен`);
                } else {
                    res.status(404).send('Баннер не найден');
                }
            })
            .catch(() => {
                res.status(500).send('Ошибка обновления баннера');
            });
    });

    return router;
};

module.exports = createHeroesRoutes;

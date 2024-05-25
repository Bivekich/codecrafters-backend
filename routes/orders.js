const express = require('express');
const { ObjectId } = require('mongodb');

const createOrdersRoutes = (db) => {
    const router = express.Router();
    const ordersCollection = db.collection('orders');

    router.get('/', async (req, res) => {
        try {
            const orders = await ordersCollection.find().toArray();
            res.json(orders);
        } catch (error) {
            res.status(500).send('Ошибка при получении заказов');
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { id, image, title, link } = req.body;
            const newOrder = { id, image, title, link };
            const result = await ordersCollection.insertOne(newOrder);
            res.status(201).send(`Заказ с идентификатором ${result.insertedId} успешно создан`);
        } catch (error) {
            res.status(500).send('Ошибка при создании заказа');
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { image, title, link } = req.body;
            const result = await ordersCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: { image, title, link } }
            );
            if (result.matchedCount > 0) {
                res.send(`Заказ с идентификатором ${req.params.id} Успешно обновлен`);
            } else {
                res.status(404).send('Заказ не найден');
            }
        } catch (error) {
            res.status(500).send('Ошибка при обновлении заказа');
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await ordersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount > 0) {
                res.send(`Заказ с идентификатором ${req.params.id} успешно удален`);
            } else {
                res.status(404).send('Заказ не найден');
            }
        } catch (error) {
            res.status(500).send('Ошибка при удалении заказа');
        }
    });

    return router;
};

module.exports = createOrdersRoutes;

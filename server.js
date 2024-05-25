require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const createHeroesRoutes = require('./routes/hero');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());

MongoClient.connect(MONGODB_URI)
    .then(client => {
        const db = client.db();

        app.use('/hero', createHeroesRoutes(db));

        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Ошибка подключения к MongoDB:', error);
    });

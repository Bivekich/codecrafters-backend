const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

let db;

MongoClient.connect(mongoUri)
    .then(client => {
        db = client.db();
        console.log('Успешно подключен к MongoDB');

        app.use(cors());
        app.use(express.json());

        const createHeroesRoutes = require('./routes/hero');
        const createOrdersRoutes = require('./routes/orders');
        const createTechnologiesRoutes = require('./routes/technologies')
        const createAuthRoutes = require('./routes/auth')
        const createContactRoutes = require('./routes/contact')

        app.use('/hero', createHeroesRoutes(db));
        app.use('/orders', createOrdersRoutes(db));
        app.use('/technologies', createTechnologiesRoutes(db));
        app.use('/auth', createAuthRoutes(db));
        app.use('/contact', createContactRoutes(db));

        app.listen(port, () => {
            console.log(`Сервер работает по порту: ${port}`);
        });
    })
    .catch(error => {
        console.error('Ошибка при подключении к MongoDB:', error);
        process.exit(1);
    });

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
app.use(bodyParser.json());

const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'SmartHomeDB';

async function connect() {
    try {
        const client = new MongoClient(dbUrl);
        await client.connect();
        console.log('Pomyślnie połączono z bazą danych!');

        const db = client.db(dbName);
        const usersCollection = db.collection('users')

        app.get('/', async(req, res) => {
            try {
                res.send('smarthome');
            } catch (err) {
                console.error(err);
            }
        });

        app.get('/user', async (req, res) => {
            try {
                console.log('dostalem zadanie');
                const { user, pass } = req.body;
                const existingUser = await usersCollection.findOne({username: user, password: pass});

                if (existingUser) {
                    res.json({ status: 'success', key: "key" });
                } else {
                    res.send({ status: 'failure' });
                }
            } catch (err) {
                console.error(err);
            }
        });

    } catch (err) {
        console.error('Wystąpił błąd podczas łączenia z bazą.', err);
    }
}

connect();
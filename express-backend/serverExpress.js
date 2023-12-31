'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenKey = require('./tokenKey')

const app = express();
const port = 3000;
app.use(cors());
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

    app.post('/auth', async (req, res) => {
      try {
        const { user, pass } = req.body;
        const existingUser = await usersCollection.findOne({ username: user });
        if (existingUser && await bcrypt.compare(pass, existingUser.password)) {
          const accessToken = jwt.sign({ user: existingUser.username }, tokenKey, { expiresIn: '1h' });
          res.json({ status: 'success', key: accessToken });
        } else {
          res.send({ status: 'failure' });
        }
      } catch (err) {
        console.error(err);
      }
    });

    app.listen(port, () => {
      console.log(`Serwer działa na porcie: ${port}`);
    });

    } catch (err) {
      console.error('Wystąpił błąd podczas łączenia z bazą.', err);
    }
}

connect();
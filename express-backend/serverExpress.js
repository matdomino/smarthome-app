'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenKey = require('./tokenKey');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: 'http://localhost:3001'
}));
app.use(bodyParser.json());
app.use(cookieParser());

const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'SmartHomeDB';


async function connect() {
  try {
    const client = new MongoClient(dbUrl);
    await client.connect();
    console.log('Pomyślnie połączono z bazą danych!');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    app.post('/auth', async (req, res) => {
      try {
        const { user, pass } = req.body;
        const existingUser = await usersCollection.findOne({ username: user });
        if (existingUser && await bcrypt.compare(pass, existingUser.password)) {
          const accessToken = jwt.sign({ user: existingUser.username }, tokenKey, { expiresIn: '1h' });
          res.cookie('username', user, {
            httpOnly: true
          });
          res.cookie('accessToken', accessToken, {
            httpOnly: true
          });
          res.json({ status: 'success' });
        } else {
          res.send({ status: 'failure' });
        }
      } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.post('/createacc', async (req, res) => {
      try {
        const { email, user, pass } = req.body;

        let correctData = true;

        if (!email || typeof(email) !== "string" || email.length > 35) {
          correctData = false;
        } else if (!user || typeof(user) !== "string" || user.length < 5 || user.length > 20) {
          correctData = false;
        } else if (!pass || typeof(pass) !== "string" || pass.length < 5 || pass.length > 40) {
          correctData = false;
        }

        if (correctData) {
          const existingUsernameAcc = await usersCollection.findOne({ username: user });
          const existingEmailAcc = await usersCollection.findOne({ email: email });
          const encryptedPass = await bcrypt.hash(pass, 10);

          if (existingUsernameAcc === null && existingEmailAcc === null) {
            const newUser = {
              email: email,
              username: user,
              password: encryptedPass
            };

            const addUser = await usersCollection.insertOne(newUser);

            if (addUser.acknowledged === true) {
              const accessToken = jwt.sign({ user: user }, tokenKey, { expiresIn: '1h' });
              res.json({ status: 'success', key: accessToken });
            } else {
              return res.status(500).json({ error: 'Nie udało się dodać użytkoniwka.' });
            }

          } else {
            res.status(409).json({ error: "Użytkownik o podanym adresie email lub nazwie konta już istnieje" });
          }
        } else {
          res.status(400).json({ error: "Nieprawidłowe dane wejściowe." });
        }

      } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.get('/userdata', async (req, res) => {
      try {
        console.log(req.cookies);

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
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
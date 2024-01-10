'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
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
    const devicesCollection = db.collection('devices');

    const clearAllCookies = (res) => {
      res.clearCookie('LoggedInUser');
      res.clearCookie('accessToken');
      res.clearCookie('username');
    };

    app.post('/auth', async (req, res) => {
      try {
        const { user, pass } = req.body;
        const existingUser = await usersCollection.findOne({ username: user });
        if (existingUser && await bcrypt.compare(pass, existingUser.password)) {
          const accessToken = jwt.sign({ user: existingUser.username }, tokenKey, { expiresIn: '1h' });
          res.cookie('username', user, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
          });
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
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
              password: encryptedPass,
              devices: []
            };

            const addUser = await usersCollection.insertOne(newUser);

            if (addUser.acknowledged === true) {
              const accessToken = jwt.sign({ user: user }, tokenKey, { expiresIn: '1h' });
              res.cookie('username', user, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
              });
              res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
              });
              res.json({ status: 'success' });
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

    app.delete('/logout', async (req, res) => {
      try{
        clearAllCookies(res);
        res.json({ status: 'success' });
      } catch (err) {
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.get('/userdata', async (req, res) => {
      try {
        const user = req.cookies.username;
        const accessToken = req.cookies.accessToken;

        if (!user || !accessToken) {
          clearAllCookies(res);
          return res.status(401).json({ error: "Brak autoryzacji." });
        }

        jwt.verify(accessToken, tokenKey, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ error: "Brak autoryzacji." });
          }

          if (user !== decoded.user) {
            clearAllCookies(res);
            return res.status(401).json({ error: "Brak autoryzacji." });
          }

          const data = await usersCollection.findOne({ username: user });

          res.json({ status: 'success', userData: data});
        });

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });
  
    app.post('/adddevice', async (req, res) => {
      try {
        const user = req.cookies.username;
        const accessToken = req.cookies.accessToken;
        const { name, ipAdress, id, deviceType } = req.body;

        if (!user || !accessToken) {
          clearAllCookies(res);
          return res.status(401).json({ error: "Brak autoryzacji." });
        }

        jwt.verify(accessToken, tokenKey, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ error: "Brak autoryzacji." });
          }

          if (user !== decoded.user) {
            clearAllCookies(res);
            return res.status(401).json({ error: "Brak autoryzacji." });
          }

          const data = await usersCollection.findOne({ username: user });

          if (data.devices.length > 10) {
            return res.status(403).json({ error: "Osoiągnięto maksymalną ilość urządzeń." });
          }

          let correctData = true;
          const allowedDeviceTypes = ["SmartBulb", "SmartLock", "SmartCurtains", "smartAC", "thermometer"];

          if (!name || typeof(name) !== "string" || name.length < 3 || name.length > 20) {
            correctData = false;
          } else if (!ipAdress || typeof(ipAdress) !== "string" || !/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/.test(ipAdress)) {
            correctData = false;
          } else if (!id || typeof(id) !== "string" || id.length < 5 || id.length > 20) {
            correctData = false;
          } else if (!allowedDeviceTypes.includes(deviceType)) {
            correctData = false;
          }

          if (correctData) {
            let device = {
              user: data._id,
              deviceType: deviceType
            }

            if (deviceType === "SmartBulb") {
              device = {
                ...device,
                on: true,
                brightness: 100,
                logs: []
              }
            } else if (deviceType === "SmartLock") {
              device = {
                ...device,
                open: true,
                PIN: "0000",
                logs: []
              }
            } else if (deviceType === "SmartCurtains") {
              device = {
                ...device,
                open: true,
                openPercent: 100,
                logs: []
              }
            } else if (deviceType === "smartAC") {
              device = {
                ...device,
                on: true,
                temp: 20,
                logs: []
              }
            } else if (deviceType === "thermometer") {
              device = {
                ...device,
                humidity: 50,
                temp: 20,
                logs: []
              }
            }

            const insertDevice = await devicesCollection.insertOne({ device });
            const deviceInfo = {
              deviceId: insertDevice.insertedId,
              name: name,
              ipAdress: ipAdress,
              id: id
            }
            const userUpdate = await usersCollection.updateOne({ username: user }, { $set: { devices: [...data.devices, deviceInfo] }});

            if (insertDevice.acknowledged === true && userUpdate.acknowledged === true) {
              res.json({ status: 'success', device: device});
            }
          }
        });

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
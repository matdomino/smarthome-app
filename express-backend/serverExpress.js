'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const tokenKey = process.env.TOKEN_KEY;

if (!tokenKey) {
  throw new Error("TOKEN_KEY is not set in the environment variables");
}

const app = express();
const port = 3000;
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: 'http://localhost:8080'
}));
app.use(bodyParser.json());
app.use(cookieParser());

const dbUrl = 'mongodb://mongo-db:27017/';
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

    async function verifyAuth(req, res) {
      const user = req.cookies.username;
      const accessToken = req.cookies.accessToken;
      if (!user || !accessToken) {
        clearAllCookies(res);
        return res.status(401).json({ error: "Brak autoryzacji." });
      }

      try {
        const decoded = await jwt.verify(accessToken, tokenKey);
        if (user !== decoded.user) {
          clearAllCookies(res);
          return res.status(401).json({ error: "Brak autoryzacji." });
        }

        return true;
      } catch (err) {
        clearAllCookies(res);
        return res.status(401).json({ error: "Brak autoryzacji." });
      }
    }

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

        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const data = await usersCollection.findOne({ username: user });
        res.json({ status: 'success', userData: data});

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.post('/adddevice', async (req, res) => {
      try {
        const user = req.cookies.username;
        const { name, ipAdress, id, deviceType } = req.body;

        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const data = await usersCollection.findOne({ username: user });

        const existingIp = data.devices.find(device => device.ipAdress === ipAdress);
        const existingId = data.devices.find(device => device.id === id);

        if (existingIp) {
          return res.status(400).json({ error: "Urządzenie o podanym adresie IP już istnieje." });
        }

        if (existingId) {
          return res.status(400).json({ error: "Urządzenie o podanym ID już istnieje." });
        }

        if (data.devices.length > 10) {
          return res.status(403).json({ error: "Osoiągnięto maksymalną ilość urządzeń." });
        }

        let correctData = true;
        const allowedDeviceTypes = ["SmartBulb", "SmartLock", "SmartCurtains", "smartAC", "thermometer"];

        if (!name || typeof(name) !== "string" || name.length < 3 || name.length > 20) {
          correctData = false;
        } else if (!ipAdress || typeof(ipAdress) !== "string" || !/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/.test(ipAdress)) {
          correctData = false;
        } else if (!id || typeof(id) !== "string" || id.length < 5 || id.length > 40) {
          correctData = false;
        } else if (!allowedDeviceTypes.includes(deviceType)) {
          correctData = false;
        }

        if (correctData) {
          const device = {
            user: data._id,
            deviceType: deviceType,
            id: id,
            logs: []
          };

          const insertDevice = await devicesCollection.insertOne({ device });
          const deviceInfo = {
            deviceId: insertDevice.insertedId,
            name: name,
            ipAdress: ipAdress
          };
          const userUpdate = await usersCollection.updateOne({ username: user }, { $set: { devices: [...data.devices, deviceInfo] }});

          if (insertDevice.acknowledged === true && userUpdate.acknowledged === true) {
            res.json({ status: 'success', device: deviceInfo});
          }
        }

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.get('/getdevice/:deviceId', async (req, res) => {
      try {
        const user = req.cookies.username;
        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const { deviceId } = req.params;

        const existingUser = await usersCollection.findOne({ username: user });
        const device = await devicesCollection.findOne({ _id: new ObjectId(deviceId) });

        if (device && existingUser._id.equals(device.device.user)) {
          res.json({ status: 'success', device: device});
        } else {
          res.status(404).json({ error: "Nie znaleziono urządzenia." });
        }

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.put('/usernamechange', async (req, res) => {
      try {
        const userName = req.cookies.username;
        const { user, pass } = req.body;

        if (!pass || !user) {
          return res.status(400).json({ error: "Zmanipulowano dane" });
        }

        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const existingUsername = await usersCollection.findOne({ username: user });
        if (existingUsername) {
          return res.status(400).json({ error: "Podana nazwa użytkownika jest zajęta." });
        }

        const existingUser = await usersCollection.findOne({ username: userName });

        if (await bcrypt.compare(pass, existingUser.password)) {
          const update = await usersCollection.updateOne({ _id: existingUser._id }, { $set: { username: user } });

          if (update.acknowledged === true) {
            clearAllCookies(res);
            res.json({ status: "success" });
          }
        } else {
          res.status(400).json({ error: "Niepoprawne hasło" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.put('/passwordchange', async (req, res) => {
      try {
        const userName = req.cookies.username;
        const { pass } = req.body;

        if (!pass) {
          return res.status(400).json({ error: "Zmanipulowano dane" });
        }

        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const existingUser = await usersCollection.findOne({ username: userName });

        if (await bcrypt.compare(pass, existingUser.password) === false) {
          const encryptedPass = await bcrypt.hash(pass, 10);

          const update = await usersCollection.updateOne({ username: userName }, { $set: { password: encryptedPass } });

          if (update.acknowledged === true) {
            clearAllCookies(res);
            res.json({ status: "success" });
          }
        } else {
          res.status(400).json({ error: "Podano obecne hasło." });
        }

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.delete('/deleteacc', async (req, res) => {
      try {
        const userName = req.cookies.username;
        const { pass } = req.body;

        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const existingUser = await usersCollection.findOne({ username: userName });

        if (await bcrypt.compare(pass, existingUser.password) === true) {
          const deleteDevices = await devicesCollection.deleteMany({ "device.user": new ObjectId(existingUser._id) });
          const deleteUser = await usersCollection.deleteOne({ username: userName });

          if (deleteDevices.acknowledged === true && deleteUser.acknowledged === true) {
            clearAllCookies(res);
            res.json({ status: "success" });
          }
        } else {
          res.status(400).json({ error: "Podano niepoprawne hasło." });
        }

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Wystąpił błąd serwera." });
      }
    });

    app.delete('/deletedevice', async (req, res) => {
      try {
        const userName = req.cookies.username;
        const { deviceId } = req.body;

        const isAuthenticated = await verifyAuth(req, res);
        if (isAuthenticated !== true) {
          return;
        }

        const existingUser = await usersCollection.findOne({ username: userName });

        const newDevices = existingUser.devices.filter((elem) => {
          return !elem.deviceId.equals(new ObjectId(deviceId));
        });

        const updateUsers = await usersCollection.updateOne({ username: userName }, { $set: { devices: newDevices } });
        const deleteDevice = await devicesCollection.deleteOne({ _id: new ObjectId(deviceId) });

        if (updateUsers.acknowledged === true && deleteDevice.acknowledged === true) {
          res.json({ status: "success" });
        }

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
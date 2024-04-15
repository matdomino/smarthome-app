const mqtt = require('mqtt');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');

const dbUrl = 'mongodb://mongo-db:27017/';
const dbName = 'SmartHomeDB';

async function connect() {
  const listener = mqtt.connect('ws://localhost:8000/mqtt');
  listener.subscribe('#');

  const client = new MongoClient(dbUrl);
  await client.connect();

  console.log('Pomyślnie połączono z bazą danych!');
  const db = client.db(dbName);
  const devicesCollection = db.collection('devices');

  listener.on('message', async (topic, message) => {
    const isDeviceInDb = await devicesCollection.findOne({ "device.id": topic });

    if (isDeviceInDb) {
      const data = JSON.parse(message.toString());
      const dataWithDate = { ...data, date: new Date() }
      const updatedLogs = [...isDeviceInDb.device.logs, dataWithDate];

      const req = await devicesCollection.updateOne(
        { _id: new ObjectId(isDeviceInDb._id) },
        { $set: { 'device.logs': updatedLogs } }
      );

      if (req.acknowledged !== true) {
        console.log(`BŁĄD: Nie udało się zaktualizować logów dla ${topic}`);
      }
    } else {
      console.log(`BŁĄD: Nie ma urządzenia o id: ${topic} w bazie danych`);
    }
  });
}

connect();
const mqtt = require('mqtt');
const fs = require('fs');

const configFile = fs.readFileSync('config.json');
const deviceConfig = JSON.parse(configFile);

const device = mqtt.connect('mqtt://localhost:1883');

device.on('connect', function() {
  console.log('Połączono z brokerem MQTT');
  console.log(`DeviceId: ${deviceConfig.deviceId}`);
  console.log(`Typ urządzenia: ${deviceConfig.deviceType}`);
  device.subscribe(`${deviceConfig.deviceId}`);
  device.publish(`${deviceConfig.deviceId}`, JSON.stringify({ msg: `Urządzenie ${deviceConfig.deviceId} online.` }));
});

const smartBulb = () => {
  let settings = {
    on: true,
    brightness: 100
  };

  device.on('message', (topic, message) => {
    if (topic === `${deviceConfig.deviceId}`) {
      const data = JSON.parse(message.toString());
      if (data.msg === "R: włącz/wyłącz żarówke") {
        let response;

        setTimeout(() => {
          if (settings.on === true) {
            settings.on = false;
            response = "Wyłączono żarówke"
          } else {
            settings.on = true;
            response = "Włączono żarówke"
          }
          device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: response}));
        }, 500);
      } else if (data.msg === "R: zmień jasność na:") {
        setTimeout(() => {
          const newBrightness = data.value;

          if (!isNaN(newBrightness) && newBrightness > 0 && newBrightness <= 100) {
            settings.brightness = newBrightness;
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Zmieniono jasność na:', value: newBrightness}));
          } else {
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'BŁĄD: Niepoprawna wartość dla jasności.'}));
          }
        }, 500);
      }
    }
  });
};

const smartLock = () => {
  let settings = {
    opened: true,
    PIN: "0000"
  };

  device.on('message', (topic, message) => {
    if (topic === `${deviceConfig.deviceId}`) {
      const data = JSON.parse(message.toString());
      if (data.msg === "R: zamknij/otwórz") {
        let response;

        setTimeout(() => {
          if (settings.opened === true) {
            settings.opened = false;
            response = "Zamknięto zamek"
          } else {
            settings.opened = true;
            response = "Otworzono zamek"
          }
          device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: response}));
        }, 500);
      } else if (data.msg === "R: zmień PIN") {
        setTimeout(() => {
          const newPIN = data.pin;
          const intPIN = parseInt(newPIN, 10);

          if (!isNaN(intPIN) && newPIN.length === 4) {
            settings.PIN = newPIN;
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Zmieniono PIN', pin: newPIN}));
          } else {
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Niepoprawny PIN'}));
          }
        }, 500);
      }
    }
  });
};

const smartCurtains = () => {
  let settings = {
    openPercent: 100,
    openAngle: 90
  };

  device.on('message', (topic, message) => {
    if (topic === `${deviceConfig.deviceId}`) {
      const data = JSON.parse(message.toString());
      if (data.msg === "R: Ustaw stopień otwarcia na:") {
        setTimeout(() => {
          const newOpenPercent = data.value;
          if (!isNaN(newOpenPercent) && newOpenPercent >= 0 && newOpenPercent <= 100 ) {
            settings.openPercent = newOpenPercent;
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Zmieniono stopień otwarcia na:', value: newOpenPercent}));
          } else {
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Niepoprawny stopień otwarcia'}));
          }
        }, 500);
      } else if (data.msg === "R: Ustaw kąt otwarcia na:") {
        setTimeout(() => {
          const newOpenAngle = data.value;
          if (!isNaN(newOpenAngle) && newOpenAngle >= 0 && newOpenAngle <= 90) {
            settings.openAngle = newOpenAngle;
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Zmieniono kąt otwarcia na:', value: newOpenAngle}));
          } else {
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'BŁĄD: Niepoprwany kąt otwarcia'}));
          }
        }, 500);
      }
    }
  });
};

const smartAC = () => {
  let settings = {
    on: true,
    temperature: 20
  }

  const sendTemp = () => {
    if (settings.on === true) {
      const randomOffset = Math.floor(Math.random() * 5) - 2;
      const randomTemp = settings.temperature + randomOffset;

      device.publish(`${deviceConfig.deviceId}`, JSON.stringify({ msg: 'Aktualna temperatura:', value: randomTemp }));
    }
  }

  setInterval(sendTemp, 30000);

  device.on('message', (topic, message) => {
    if (topic === `${deviceConfig.deviceId}`) {
      const data = JSON.parse(message.toString());
      if (data.msg === "R: włącz/wyłącz klimatyzacje") {
        let response;

        setTimeout(() => {
          if (settings.on === true) {
            settings.on = false;
            response = "Wyłączono klimatyzacje."
          } else {
            settings.on = true;
            response = "Włączono klimatyzacje."
          }
          device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: response}));
        }, 500);
      } else if (data.msg === "R: Ustaw temperature na:") {
        setTimeout(() => {
          const newTemp = data.value;
          if (!isNaN(newTemp) && newTemp >= 5 && newTemp <= 40) {
            settings.temperature = Number(newTemp);
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Zmieniono temperature na:', value: newTemp}));
          } else {
            device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'BŁĄD: niepoprawna temperatura'}));
          }
        }, 500);
      }
    }
  });
};

const smartThermometer = () => {
  let settings = {
    on: true,
  }

  const sendRandomTemp = () => {
    if (settings.on === true) {
      const randomTemperature = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
      const randomHumidity = Math.floor(Math.random() * (60 - 50 + 1)) + 50;
      const stringHumidity = randomHumidity.toString() + "%";

      device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: 'Temperatura i wilgotność:', value: randomTemperature, value2: stringHumidity }));
    }
  }

  setInterval(sendRandomTemp, 30000);

  device.on('message', (topic, message) => {
    if (topic === `${deviceConfig.deviceId}`) {
      const data = JSON.parse(message.toString());
      if (data.msg === "R: włącz/wyłącz termometr") {
        let response;

        setTimeout(() => {
          if (settings.on === true) {
            settings.on = false;
            response = "Wyłączono termometr.";
          } else {
            settings.on = true;
            response = "Włączono termometr.";
          }
          device.publish(`${deviceConfig.deviceId}`, JSON.stringify({msg: response}));
        }, 500);
      }
    }
  });
};


const idLength = deviceConfig.deviceId.length;
const idType = typeof deviceConfig.deviceId;

const isValidConfig = idType === "string" && idLength >= 5;

if (!isValidConfig) {
  console.log("Błędna konfiguracja ID w config.json");
  process.emit('SIGINT');
}

const deviceTypes = {
  "SmartBulb": smartBulb,
  "SmartLock": smartLock,
  "SmartCurtains": smartCurtains,
  "smartAC": smartAC,
  "thermometer": smartThermometer
};

const currentDeviceType = deviceTypes[deviceConfig.deviceType];

if (currentDeviceType) {
  currentDeviceType();
} else {
  console.log("Nieznany typ urządzenia w config.json");
  process.emit('SIGINT');
}

process.on('SIGINT', async function() {
  await device.publish(`${deviceConfig.deviceId}`, JSON.stringify({ msg: `Urządzenie ${deviceConfig.deviceId} offline.` }));
  device.end();
  process.exit();
});

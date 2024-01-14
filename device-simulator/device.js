const mqtt = require('mqtt');
const fs = require('fs');

const configFile = fs.readFileSync('config.json');
const deviceConfig = JSON.parse(configFile);

const device = mqtt.connect('mqtt://localhost:1883');

device.on('connect', function() {
  console.log('Połączono z brokerem MQTT');
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
      if (message.toString() === "R: włącz/wyłącz żarówke") {
        let response;

        if (settings.on === true) {
          settings.on = false;
          response = "Wyłączono żarówke."
        } else {
          settings.on = true;
          response = "Włączono żarówke."
        }
        device.publish(`${deviceConfig.deviceId}`, response);
      } else if (message.toString().startsWith("R: zmień jasność na:")) {
        let response;
        const newBrightness = parseInt(message.toString().slice(-3), 10);

        if (!isNaN(newBrightness) && newBrightness > 0 && newBrightness <= 100) {
          settings.brightness = newBrightness;
          response = `Zmieniona jasność na:  ${newBrightness}`;
        } else {
          response = `BŁĄD: Niepoprawna wartość dla jasności.`;
        }
        device.publish(`${deviceConfig.deviceId}`, response);
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
      if (message.toString() === "R: zamknij/otwórz") {
        let response;

        if (settings.opened === true) {
          settings.on = false;
          response = "Zamknięto zamek."
        } else {
          settings.on = true;
          response = "Otworzono zamek."
        }
        device.publish(`${deviceConfig.deviceId}`, response);
      } else if (message.toString().startsWith("R: zmień PIN na:")) {
        let response;
        const intPIN = parseInt(message.toString().slice(-4), 10);
        const newPIN = intPIN.toString();

        if (!isNaN(newBrightness) && newPIN.length === 4) {
          settings.PIN = newPIN;
          response = `Zmieniono PIN na:  ${newPIN}`;
        } else {
          response = `BŁĄD: Niepoprwany PIN.`;
        }
        device.publish(`${deviceConfig.deviceId}`, response);
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
      if (message.toString().startsWith("R: Ustaw stopień otwarcia na:")) {
        const newOpenPercent = parseInt(message.toString().slice(-3), 10);
        let response;
        if (!isNaN(newOpenPercent) && newOpenPercent >= 0 && newOpenPercent <= 100 ) {
          settings.openPercent = newOpenPercent;
          response = `Zmieniono stopień otwarcia na:  ${newOpenPercent}`;
        } else {
          response = `BŁĄD: Niepoprwany stopień otwarcia.`;
        }
        device.publish(`${deviceConfig.deviceId}`, response);
      } else if (message.toString().startsWith("R: Ustaw kąt otwarcia na:")) {
        const newOpenAngle = parseInt(message.toString().slice(-2), 10);
        let response;
        if (!isNaN(newOpenAngle) && newOpenAngle >= 0 && newOpenAngle <= 90) {
          settings.openAngle = newOpenAngle;
          response = `Zmieniono kąt otwarcia na:  ${newOpenAngle}`;
        } else {
          response = `BŁĄD: Niepoprwany kąt otwarcia.`;
        }
        device.publish(`${deviceConfig.deviceId}`, response);
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

      const msg = `Aktualna temperatura: ${randomTemp}`;
      const msgObj = { msg: msg, value: randomTemp };
      
      console.log('wysylam');
      device.publish(`${deviceConfig.deviceId}`, JSON.stringify(msgObj));
    }
  }

  setInterval(sendTemp, 30000);

  device.on('message', (topic, message) => {
    if (topic === `${deviceConfig.deviceId}`) {
      if (message.toString() === "R: włącz/wyłącz klimatyzacje") {
        let response;

        if (settings.on === true) {
          settings.on = false;
          response = "Wyłączono klimatyzacje."
        } else {
          settings.on = true;
          response = "Włączono klimatyzacje."
        }
        device.publish(`${deviceConfig.deviceId}`, response);
      } else if (message.toString().startsWith("R: Ustaw temperature na:")) {
        const newTemp = parseInt(message.toString().slice(-2), 10);
        let response;
        if (!isNaN(newTemp) && newTemp >= 5 && newTemp <= 40) {
          settings.temperature = newTemp;
          response = `Zmieniono temperature na:  ${newTemp}`;
        } else {
          response = `BŁĄD: niepoprawna temperatura.`;
        }
        device.publish(`${deviceConfig.deviceId}`, response);
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
      
      const msg = `Temperatura: ${randomTemperature}, wilgotność: ${randomHumidity}`;
      device.publish(`${deviceConfig.deviceId}`, msg);
    }
  }

  setInterval(sendRandomTemp, 30000);

  device.on('message', (topic, message) => {
    if (message.toString() === "R: włącz/wyłącz termometr") {
      let response;

      if (settings.on === true) {
        settings.on = false;
        response = "Wyłączono termometr.";
      } else {
        settings.on = true;
        response = "Włączono termometr.";
      }
      device.publish(`${deviceConfig.deviceId}`, response);
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

process.on('SIGINT', function() {
  device.publish(`${deviceConfig.deviceId}`, `Urządzenie ${deviceConfig.deviceId} offline.`);
  device.end();
  process.exit();
});

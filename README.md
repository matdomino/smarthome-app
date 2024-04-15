# Smart Home web panel
## Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Devices description](#devices-description)
4. [Author](#author)

## Introduction
A web application with a control panel for managing multiple devices for different users. After logging in, add a device to your profile, and then you can control it `(IMPORTANT: Fill the IP Address field with valid input - can be random)`.

### Used technology:
- Next.js, React,
- Node.js, express,
- Jsonwebtoken,
- MognoDB,
- WebSocket,
- MQTT - HiveMQ CE

## Installation
Run using Docker with commands below `(run commands in /smarthome-app/ directory)`:

### Step 0 (optional)
Uncomment this line in `docker-compose.yml` if you want to access database outside Docker.
```
ports:
  - "27017:27017"
```

### Step 1
Create HiveMQ CE image with custom config for MQTT broker:
```
docker build -t mqtt-broker .
```

### Step 2
Set up containers with db, back-end, front-end, mqtt-broker, mqtt-backend:
```
docker-compose up -d
```

### Step 3
Set up database collections and example user:
```
docker exec -it smart-home-db mongosh smart-home-db ./setup/dbconfiguration.mongodb.js
```

### Step 4
Setup device simulator by running the commands below. The files are located in `/smarthome-app/device-simulator/`:
```
cd device-simulator
npm install
node device.js
```

#### IMPORTANT: deviceId, and deviceType parameters are located in `/smarthome-app/device-simulator/config.js`

#### Optional:
- Change deviceId to test multiple devices in `/smarthome-app/device-simulator/config.json` - you can use `IDGen.js` file to get random ID.

- Change deviceType in `/smarthome-app/device-simulator/config.json`. Implemented options:
    - `SmartBulb`,
    - `SmartLock`,
    - `SmartCurtains`,
    - `smartAC`,
    - `thermometer`

### Step 5
Access the app at link below:
#### [http://localhost:8080/](http://localhost:8080/)

## Devices description

### Devices

`SmartBulb` - Turn off/on, adjust brightness.

`SmartLock` - Lock/unlock, change PIN. 

`SmartCurtains` - Adjust open percentage and open angle.

`smartAC` - Turn off/on, adjust temperature. Device sends current simulated temperature every 30 seconds.

`thermometer` - Turn off/on. Device sends simulated temperature every 30 seconds.

## Author
* ### Mateusz Domino: [LinkedIn](https://www.linkedin.com/in/mateusz-domino-214927270/)
* ### Email: [matdomino@outlook.com](mailto:matdomino@outlook.com)
import React, { useEffect, useState, useContext } from 'react';
import mqtt from 'mqtt';
import DevicesContext from '../context/DevicesProvider';

const LiveLogs = () => {
  const [list, setList] = useState([]);
  const { selectedData } = useContext(DevicesContext);

  useEffect(() => {
    if (selectedData !== null) {
      const client = mqtt.connect('ws://localhost:8000/mqtt');

      client.subscribe(`${selectedData.device.device.id}`);

      client.on('message', (topic, message) => {
        const data = JSON.parse(message.toString());
        setList((prevList) => [...prevList, data]);
      });

      return () => {
        setList([]);
        client.unsubscribe(`${selectedData.device.device.id}`);
        client.end();
      };
    }
  }, [selectedData]);

  return (
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item.msg} {item.value && ` ${item.value}`} {item.value2 && ` ${item.value2}`}</li>
        ))}
      </ul>
  );
};

export default LiveLogs;

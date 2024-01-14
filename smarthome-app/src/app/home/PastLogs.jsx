import React, { useEffect, useContext } from 'react';
import DevicesContext from '../context/DevicesProvider';

const formatDate = (date) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = dateObj.toLocaleTimeString();
  return `${formattedDate} ${formattedTime}`;
}

const PastLogs = () => {
  const { selectedData } = useContext(DevicesContext);

  useEffect(() => {
    if (selectedData !== null) {
      console.log(selectedData);
    }

  }, [selectedData]);

  return(
    <ul>
      {selectedData && selectedData.device.device.logs.map((log, index) => (
        <li key={index}>
          {formatDate(log.date)}, wiadomość: {log.msg}
        </li>
      ))}
    </ul>
  );
};

export default PastLogs;

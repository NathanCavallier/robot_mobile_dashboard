import React, { useEffect, useState } from 'react';
import { fetchRobotLogs } from '../services/api';

export default function RobotLogTable() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchRobotLogs();
      setLogs(data.reverse());
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Historique du robot</h2>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Heure</th><th>Objet</th><th>Mouvement</th><th>Batterie (V)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
              <td>{log.detectedObject}</td>
              <td>{log.motorStatus}</td>
              <td>{log.battery.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

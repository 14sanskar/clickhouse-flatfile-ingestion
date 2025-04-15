import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [source, setSource] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [database, setDatabase] = useState('');
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  const connectClickHouse = async () => {
    setStatus("Connecting...");
    try {
      const res = await axios.post('/api/connect', {
        host, port, database, user, token
      });
      setStatus(res.data.message);
    } catch (err) {
      setStatus("Connection failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ClickHouse ↔ Flat File Ingestion</h1>

      <label>Select Source:</label>
      <select onChange={(e) => setSource(e.target.value)}>
        <option value="">--Select--</option>
        <option value="clickhouse">ClickHouse</option>
        <option value="flatfile">Flat File</option>
      </select>

      {source === 'clickhouse' && (
        <div>
          <input placeholder="Host" value={host} onChange={e => setHost(e.target.value)} />
          <input placeholder="Port" value={port} onChange={e => setPort(e.target.value)} />
          <input placeholder="Database" value={database} onChange={e => setDatabase(e.target.value)} />
          <input placeholder="User" value={user} onChange={e => setUser(e.target.value)} />
          <input placeholder="JWT Token" value={token} onChange={e => setToken(e.target.value)} />
          <button onClick={connectClickHouse}>Connect</button>
        </div>
      )}

      <div>Status: {status}</div>
    </div>
  );
};

export default App

import logo from './logo.svg';
import './App.css';
import React from 'react';
import PredictTrash from './components/PredictTrash';
import RobotLogTable from './components/RobotLogTable';

function App() {
  return (
    <div className="App">
      <h1>Dashboard Robot & IA</h1>
      <PredictTrash />
      <RobotLogTable />
    </div>
  );
}

export default App;

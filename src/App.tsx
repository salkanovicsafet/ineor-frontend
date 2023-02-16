import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './assets/styles/reset.css';
import Home from './pages/Home';
import Success from './pages/Success';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="success" element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;

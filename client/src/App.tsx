import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PacketCapture from './pages/PacketCapture';
import TrafficAnalysis from './pages/TrafficAnalysis';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container" style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/capture" element={<PacketCapture />} />
          <Route path="/analysis" element={<TrafficAnalysis />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

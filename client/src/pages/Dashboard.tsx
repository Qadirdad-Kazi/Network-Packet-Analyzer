import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isCapturing, setIsCapturing] = useState(false);
  const [packetCount, setPacketCount] = useState(0);

  useEffect(() => {
    const socket = socketService.connect();

    // Fetch initial status
    fetch('http://localhost:5001/api/capture/status')
      .then(res => res.json())
      .then(data => {
        setIsCapturing(data.isCapturing);
        setPacketCount(data.totalPackets);
      })
      .catch(err => console.error('Failed to fetch status:', err));

    // Listen for updates
    socket.on('captureState', (data) => {
      setIsCapturing(data.isCapturing);
      setPacketCount(data.packetCount);
    });

    socket.on('packet', () => {
      setPacketCount(prev => prev + 1);
    });

    return () => {
      socket.off('captureState');
      socket.off('packet');
    };
  }, []);

  return (
    <div className="card">
      <h1 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Packet Analyzer Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Welcome to NetAnalyzer. Capture and analyze network traffic.</p>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', border: '1px solid var(--primary-color)' }}>
          <h3>Live Capture</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>Monitor network traffic in real-time.</p>
          <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isCapturing ? '#22c55e' : '#ef4444' }}></div>
            <span style={{ fontWeight: 'bold' }}>{isCapturing ? 'Capturing via Virtual Interface' : 'Idle'}</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/capture')}
          >
            Go to Capture
          </button>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--background-dark)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <h3>Statistics</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
            <li style={{ fontSize: '0.9rem', padding: '0.5rem 0', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Packets Captured</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{packetCount}</span>
            </li>
            <li style={{ fontSize: '0.9rem', padding: '0.5rem 0', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Interface</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>en0 (Simulated)</span>
            </li>
          </ul>
          <button
            className="btn"
            style={{ marginTop: '1rem', width: '100%', backgroundColor: '#334155', color: 'white' }}
            onClick={() => navigate('/analysis')}
          >
            View Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

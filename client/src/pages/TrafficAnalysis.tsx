import React, { useState, useEffect } from 'react';
import socketService from '../services/socket';

const TrafficAnalysis: React.FC = () => {
    const [protocols, setProtocols] = useState<{ [key: string]: number }>({});

    const fetchStats = () => {
        fetch('http://localhost:5001/api/analysis/protocols')
            .then(res => res.json())
            .then(data => setProtocols(data));
    };

    useEffect(() => {
        fetchStats();

        // Auto refresh every 2 seconds
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, []);

    const total = Object.values(protocols).reduce((a, b) => a + b, 0);

    return (
        <div className="card">
            <h1>Traffic Analysis</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Statistics and distribution of captured traffic.</p>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Protocol Distribution */}
                <div style={{ padding: '1.5rem', backgroundColor: '#1e2030', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <h3>Protocol Distribution</h3>
                    {total === 0 ? <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No data available.</p> : (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.entries(protocols).sort((a, b) => b[1] - a[1]).map(([proto, count]) => {
                                const percentage = ((count / total) * 100).toFixed(1);
                                return (
                                    <div key={proto}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                            <span>{proto}</span>
                                            <span>{count} ({percentage}%)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${percentage}%`,
                                                height: '100%',
                                                backgroundColor: proto === 'TCP' ? '#38bdf8' : proto === 'UDP' ? '#facc15' : '#4ade80'
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div style={{ padding: '1.5rem', backgroundColor: '#1e2030', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <h3>Capture Summary</h3>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Packets</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{total}</div>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Dominant Protocol</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                {Object.entries(protocols).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrafficAnalysis;

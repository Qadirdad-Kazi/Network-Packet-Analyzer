import React, { useState, useEffect, useRef } from 'react';
import socketService from '../services/socket';

interface Packet {
    id: number;
    timestamp: string;
    srcIp: string;
    dstIp: string;
    protocol: string;
    length: number;
    info: string;
}

const PacketCapture: React.FC = () => {
    const [packets, setPackets] = useState<Packet[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        const socket = socketService.connect();

        // Initial state
        fetch('http://localhost:5001/api/capture/status')
            .then(res => res.json())
            .then(data => setIsCapturing(data.isCapturing));

        // Listen for new packets
        socket.on('packet', (packet: Packet) => {
            setPackets(prev => [...prev, packet]);
        });

        socket.on('captureState', (data) => {
            setIsCapturing(data.isCapturing);
            if (data.packetCount === 0) setPackets([]);
        });

        return () => {
            socket.off('packet');
            socket.off('captureState');
        };
    }, []);

    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [packets, autoScroll]);

    const toggleCapture = async () => {
        if (isCapturing) {
            await fetch('http://localhost:5001/api/capture/stop', { method: 'POST' });
        } else {
            await fetch('http://localhost:5001/api/capture/start', { method: 'POST' });
        }
    };

    const clearCapture = async () => {
        await fetch('http://localhost:5001/api/capture/clear', { method: 'POST' });
        setPackets([]);
    };

    return (
        <div className="card" style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>Packet Capture</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn"
                        style={{ backgroundColor: isCapturing ? '#ef4444' : '#22c55e', color: 'white', minWidth: '100px' }}
                        onClick={toggleCapture}
                    >
                        {isCapturing ? 'Stop' : 'Start'}
                    </button>
                    <button className="btn" style={{ backgroundColor: '#64748b', color: 'white' }} onClick={clearCapture}>
                        Clear
                    </button>
                    <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} />
                        <label style={{ color: 'var(--text-secondary)' }}>Auto-scroll</label>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#1e2030', border: '1px solid var(--border-color)', borderRadius: '0.5rem', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '80px 120px 140px 140px 80px 80px 1fr', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#0f172a', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <div>No.</div>
                    <div>Time</div>
                    <div>Source</div>
                    <div>Destination</div>
                    <div>Proto</div>
                    <div>Len</div>
                    <div>Info</div>
                </div>

                {/* Table Body */}
                <div ref={scrollRef} style={{ overflowY: 'auto', flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {packets.map((pkt, i) => (
                        <div key={pkt.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 120px 140px 140px 80px 80px 1fr',
                            gap: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                            color: pkt.protocol === 'TCP' ? '#a5f3fc' : pkt.protocol === 'UDP' ? '#fde047' : pkt.protocol === 'HTTP' ? '#86efac' : pkt.protocol === 'ICMP' ? '#fca5a5' : 'white'
                        }}>
                            <div>{pkt.id}</div>
                            <div>{pkt.timestamp}</div>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkt.srcIp}</div>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkt.dstIp}</div>
                            <div>{pkt.protocol}</div>
                            <div>{pkt.length}</div>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.8 }}>{pkt.info}</div>
                        </div>
                    ))}
                    {packets.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No packets captured. Click "Start" to begin sniffing.
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {packets.length} packets captured
            </div>
        </div>
    );
};

export default PacketCapture;

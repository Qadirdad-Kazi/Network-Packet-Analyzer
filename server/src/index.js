import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import PacketGenerator from './PacketGenerator.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 5001;

// State
let isCapturing = false;
let capturedPackets = [];
const packetGenerator = new PacketGenerator();
let captureInterval = null;

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state
  socket.emit('captureState', { isCapturing, packetCount: capturedPackets.length });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Capture Control Loops
const startCapture = () => {
  if (isCapturing) return;
  isCapturing = true;

  captureInterval = setInterval(() => {
    if (capturedPackets.length > 5000) {
      // Keep buffer from growing infinitely, remove oldest
      capturedPackets.shift();
    }

    // Generate a packet
    const packet = packetGenerator.generatePacket();
    capturedPackets.push(packet);

    // Broadcast to all clients
    io.emit('packet', packet);

  }, 100); // 10 packets per second
};

const stopCapture = () => {
  if (!isCapturing) return;
  isCapturing = false;
  if (captureInterval) clearInterval(captureInterval);
};

// API Endpoints

app.get('/api/packets', (req, res) => {
  // Return recent packets (limit to last 100 for initial load if needed)
  res.json(capturedPackets.slice(-100)); // Send last 100
});

app.get('/api/capture/status', (req, res) => {
  res.json({
    isCapturing,
    totalPackets: capturedPackets.length,
    duration: 'N/A' // Could implement authentic duration later
  });
});

app.post('/api/capture/start', (req, res) => {
  startCapture();
  io.emit('captureState', { isCapturing: true, packetCount: capturedPackets.length });
  res.json({ message: 'Capture started' });
});

app.post('/api/capture/stop', (req, res) => {
  stopCapture();
  io.emit('captureState', { isCapturing: false, packetCount: capturedPackets.length });
  res.json({ message: 'Capture stopped' });
});

app.post('/api/capture/clear', (req, res) => {
  capturedPackets = [];
  io.emit('captureState', { isCapturing, packetCount: 0 });
  res.json({ message: 'Capture buffer cleared' });
});

app.get('/api/analysis/protocols', (req, res) => {
  // Aggregate protocol stats
  const distribution = {};
  capturedPackets.forEach(p => {
    distribution[p.protocol] = (distribution[p.protocol] || 0) + 1;
  });
  res.json(distribution);
});

httpServer.listen(PORT, () => {
  console.log(`Packet Analyzer Server running on port ${PORT}`);
});

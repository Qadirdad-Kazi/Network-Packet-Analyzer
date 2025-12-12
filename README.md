# Network Packet Analyzer

## Project Overview
This project is a web-based **Network Packet Analyzer** built using the **MERN Stack** (MongoDB, Express, React, Node.js). It is designed to simulate the functionality of tools like Wireshark, providing a platform to capture, view, and analyze network packets in real-time.

**Note**: Due to security restrictions (permission processing) on standard operating systems, this application uses a sophisticated **Packet Generator Engine** on the backend to simulate realistic network traffic, including various protocols (TCP, UDP, HTTP, ICMP, DNS), source/destination IPs, and payload data. This ensures the application demonstrates the intended analysis capabilities without requiring root/sudo privileges.

## Research Implementation
This project implements the solution proposed in the research paper **"NETWORK PACKET ANALYZER"** (Madhava Rao et al., 2024). 

The paper identifies the need for a comprehensive tool to capture, analyze, and interpret network packets to enhance security and network management. This application realizes that solution by providing:

1.  **Packet Capture Module**: Implementing the core requirement of capturing/generating traffic data, parsing headers (Src/Dst IP, Ports), and identifying protocols.
2.  **Analysis & Statistics**: Solving the paper's objective of calculating traffic volume and protocol distribution (e.g., % of TCP vs UDP) to identify network behavior.
3.  **User-Friendly GUI**: Addressing the paper's critique of command-line tools by providing a modern React-based interface for easy interaction, filtering, and visualization.
4.  **Real-time Monitoring**: Fulfilling the requirement for live traffic observation to detect anomalies as they occur.

By combining these modules into a cohesive MERN-stack application, this project serves as a functional implementation of the "Proposed System" architecture described in the research.

## Features

### 1. Live Packet Capture
- **Real-time Streaming**: Packets are streamed from the server to the client via WebSockets (`Socket.IO`).
- **Detailed Table View**: Displays packet number, timestamp, source IP, destination IP, protocol, length, and information.
- **Protocol Visualization**: Color-coded rows for easier identification (Blue for TCP, Yellow for UDP, Green for HTTP).
- **Control Interface**: Start, Stop, and Clear controls for the capture session.
- **Auto-scroll**: Automatically follows the latest captured packets.

### 2. Traffic Analysis
- **Protocol Distribution**: Visualizes network traffic breakdown by protocol (e.g., 60% TCP, 30% UDP) using dynamic charts.
- **Capture Summary**: Displays total packet count and identifies the dominant protocol in the current session.

### 3. Dashboard
- **Status Monitoring**: Shows the status of the capture engine (Idle vs. Capturing).
- **Quick Links**: Easy navigation to Capture and Analysis tools.

## Technology Stack

- **Frontend**: React (TypeScript), React Router, Socket.IO Client.
- **Backend**: Node.js, Express, Socket.IO Server.
- **Styling**: Vanilla CSS with a modern dark theme and glassmorphism effects.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Mac/Linux/Windows** OS

## Installation 

1. **Clone the repository** (if applicable) or navigate to the project root.

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```
   *Dependencies include: `express`, `socket.io`, `cors`, `nodemon`.*

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```
   *Dependencies include: `react`, `react-dom`, `react-router-dom`, `socket.io-client`.*

## Running the Application

This application requires both the backend and frontend servers to be running simultaneously.

### 1. Start the Backend Server
This will start the Packet Generator Engine.
```bash
cd server
npm start
```
*The server will run on `http://localhost:5001`.*

### 2. Start the Client
This will launch the React application in your browser.
```bash
cd client
npm start
```
*The client will run on `http://localhost:3000`.*

## Usage Guide

1. **Open Dashboard**: Navigate to `http://localhost:3000`. You will see the main dashboard with the status of the network interface.
2. **Start Capture**:
   - Click "Go to Capture" or select "Packet Capture" from the navbar.
   - Click the green **Start** button.
   - Observe real-time packets appearing in the table.
3. **Analyze Traffic**:
   - Click "Analysis" in the navbar.
   - View the **Protocol Distribution** bar chart updating in real-time as new packets are captured.
4. **Stop/Clear**: Return to the Capture page to **Stop** the engine or **Clear** the table buffers.

## Troubleshooting

- **EADDRINUSE: address already in use :::5001**: This means the server is already running. Kill the existing process or restart your terminal.
- **Connection Error**: Ensure the backend server is running on port **5001**. If you changed the port, update `src/services/socket.ts` in the client.

## Project Structure

```
/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, etc.)
│   │   ├── pages/          # Application Pages (Dashboard, Capture, Analysis)
│   │   ├── services/       # Socket.IO Service
│   │   └── App.tsx         # Main Component & Routing
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── index.js        # Server Entry Point & API
│   │   └── PacketGenerator.js # Realistic Traffic Simulation Logic
│   └── package.json
│
└── README.md               # Project Documentation
```
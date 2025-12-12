# API Endpoints for Network Packet Flow Visualizer

## Topology Management

- `GET    /api/topology` — Get current network topology
- `POST   /api/topology` — Create or update topology (nodes & links)
- `DELETE /api/topology` — Delete/reset topology

## Node Management
- `POST   /api/nodes` — Add a node
- `PUT    /api/nodes/:id` — Update a node
- `DELETE /api/nodes/:id` — Remove a node

## Link Management
- `POST   /api/links` — Add a link
- `PUT    /api/links/:id` — Update a link
- `DELETE /api/links/:id` — Remove a link

## Simulation
- `POST   /api/simulation/start` — Start simulation with parameters
- `POST   /api/simulation/stop` — Stop simulation
- `GET    /api/simulation/status` — Get simulation status/metrics

## WebSocket Events (Socket.io)
- `packet_sent` — Packet sent from source
- `packet_queued` — Packet queued at node
- `router_received` — Router received packet
- `packet_dropped` — Packet dropped
- `packet_delivered` — Packet delivered to destination
- `metrics_update` — Live metrics (latency, throughput, etc.)

---

These endpoints and events will be implemented in the backend and consumed by the frontend for real-time updates and control.
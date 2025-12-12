// Shared data models for Network Packet Flow Visualizer
// These models are used by both frontend and backend

// Node types: router, switch, host
export type NodeType = 'router' | 'switch' | 'host';

export interface NetworkNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  queueSize: number;
  processingSpeed: number; // packets per ms or similar
}

export interface NetworkLink {
  id: string;
  source: string; // node id
  target: string; // node id
  bandwidth: number; // Mbps
  propagationDelay: number; // ms
  queueSize?: number; // optional, for link-level queueing
}

export type PacketStatus = 'in-transit' | 'queued' | 'dropped' | 'delivered';

export interface Packet {
  id: string;
  source: string; // node id
  destination: string; // node id
  size: number; // bytes
  protocol: 'TCP' | 'UDP';
  status: PacketStatus;
  path?: string[]; // node ids traversed
  timestamps?: { [nodeId: string]: number }; // arrival times per node
}

export interface SimulationParameters {
  packetSize: number;
  numberOfPackets: number;
  protocol: 'TCP' | 'UDP';
  bandwidth: number;
  delay: number;
  packetLossProbability: number;
}

export interface Topology {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

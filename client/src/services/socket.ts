import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private readonly URL = 'http://localhost:5001';

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.URL);
      this.socket.on('connect', () => {
        console.log('Connected to socket server');
      });
      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    }
    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;

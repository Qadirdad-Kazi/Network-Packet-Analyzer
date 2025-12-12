const PROTOCOLS = ['TCP', 'UDP', 'HTTP', 'ICMP', 'DNS', 'TLSv1.2'];

const COMMON_IPS = [
    '192.168.1.5', '192.168.1.10', '192.168.1.15', '192.168.1.20', // Local Clients
    '10.0.0.1', '10.0.0.2', // Gateways
    '172.217.14.206', // Google
    '157.240.22.35', // Facebook
    '142.250.193.78', // YouTube
    '104.244.42.1', // Twitter
    '52.94.233.129'  // AWS
];

class PacketGenerator {
    constructor() {
        this.packetId = 1;
    }

    generatePacket() {
        const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
        const srcIp = COMMON_IPS[Math.floor(Math.random() * COMMON_IPS.length)];
        let dstIp = COMMON_IPS[Math.floor(Math.random() * COMMON_IPS.length)];

        // Ensure src != dst
        while (dstIp === srcIp) {
            dstIp = COMMON_IPS[Math.floor(Math.random() * COMMON_IPS.length)];
        }

        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 999).toString().padStart(3, '0');

        let info = '';
        let length = 64;

        switch (protocol) {
            case 'TCP':
                info = `Seq=${Math.floor(Math.random() * 1000)} Ack=${Math.floor(Math.random() * 1000)} Win=65535 Len=${Math.floor(Math.random() * 100)}`;
                length = 54 + Math.floor(Math.random() * 1000);
                break;
            case 'UDP':
                info = `Len=${Math.floor(Math.random() * 500)}`;
                length = 42 + Math.floor(Math.random() * 500);
                break;
            case 'HTTP':
                info = Math.random() > 0.5 ? 'GET /index.html HTTP/1.1' : 'HTTP/1.1 200 OK';
                length = 200 + Math.floor(Math.random() * 800);
                break;
            case 'DNS':
                info = 'Standard query 0x' + Math.floor(Math.random() * 65535).toString(16) + ' A www.google.com';
                length = 88;
                break;
            case 'ICMP':
                info = 'Echo (ping) request id=0x' + Math.floor(Math.random() * 65535).toString(16) + ' seq=' + Math.floor(Math.random() * 1000);
                length = 98;
                break;
        }

        return {
            id: this.packetId++,
            timestamp,
            srcIp,
            dstIp,
            protocol,
            srcPort: Math.floor(Math.random() * 65535),
            dstPort: Math.floor(Math.random() * 65535),
            length,
            info
        };
    }
}

export default PacketGenerator;

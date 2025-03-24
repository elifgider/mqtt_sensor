import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3000', // Frontend URL'sini ekleyin
      methods: ['GET', 'POST'],
    },
  })
  export class SensorGateway implements OnGatewayInit {
    @WebSocketServer() server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket sunucusu hazır.');
    }
  
    sendSensorData(data: any) {
      this.server.emit('sensorData', data);
    }
  }
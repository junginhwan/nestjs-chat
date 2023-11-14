import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' }) // 웹소켓 서버 설정 데코레이터
export class ChatGateway {
  @WebSocketServer() server: Server; // 웹소켓 서버 인스턴스 선언
  @SubscribeMessage('message') // message evnet 구독
  handleMessage(socket: Socket, payload: any): void {
    const { message, nickname } = payload;
    // 접속한 클라이언트들에게 메시지 전송
    socket.broadcast.emit('message', `${nickname}: ${message}`);
  }
}

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway {
  constructor(private readonly chatGateway: ChatGateway) {}
  rooms = [];

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  handleMessage(@MessageBody() payload) {
    const { nickname, room } = payload;
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방을 만들었습니다.`,
    });
    this.rooms.push(room);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, payload) {
    const { nickname, room, toLeaveRoom } = payload;
    console.log(payload);
    socket.leave(toLeaveRoom);
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방에 입장했습니다`,
    });
    socket.join(room);
  }

  @SubscribeMessage('message') // message evnet 구독
  handleMessageToRoom(socket: Socket, payload: any) {
    const { message, nickname, room } = payload;
    console.log(message);
    // 접속한 클라이언트들에게 메시지 전송
    socket.broadcast.to(room).emit('message', {
      message: `${nickname}: ${message}`,
    });
  }
}

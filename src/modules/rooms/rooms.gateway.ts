import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { TokenPayload } from '@app/common/interface/token-payload.interface';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomsService: RoomsService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication token not provided');
      }
      const decodedToken = await this.authService.verifyToken(token);
      client.data.user = decodedToken;
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('getWaitingRooms')
  async handleGetWaitingRooms() {
    const rooms = await this.roomsService.getWaitingRooms();
    return { event: 'waitingRooms', data: rooms };
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as TokenPayload;
    if (!user) {
      return { event: 'error', data: '로그인 이후 이용 가능합니다.' };
    }
    const roomId = await this.roomsService.createRoom(createRoomDto, user.name);
    client.join(roomId);
    this.server.emit('roomCreated', { roomId, ...createRoomDto });
    return { event: 'roomCreated', data: { roomId } };
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as TokenPayload;
    try {
      await this.roomsService.joinRoom(roomId, user?.name);
      client.join(roomId);
      this.server.to(roomId).emit('userJoined', { userName: user?.name });
      return { event: 'joinedRoom', data: { roomId } };
    } catch (error) {
      return { event: 'error', data: error.message };
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as TokenPayload;
    if (!user?.name) {
      return { event: 'error', data: '유효하지 않은 사용자입니다.' };
    }
    await this.roomsService.leaveRoom(roomId);
    client.leave(roomId);
    this.server.to(roomId).emit('userLeft', { userName: user.name });
    return { event: 'leftRoom', data: { roomId } };
  }

  @SubscribeMessage('startBattle')
  async handleStartBattle(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as TokenPayload;
    if (!user) {
      return { event: 'error', data: '로그인 이후 이용 가능합니다.' };
    }
    try {
      await this.roomsService.startBattle(roomId, user.name);
      this.server.to(roomId).emit('battleStarted', { roomId });
      return { event: 'battleStarted', data: { roomId } };
    } catch (error) {
      return { event: 'error', data: error.message };
    }
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto } from './dto/room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(private redisService: RedisService) {}

  async getWaitingRooms(): Promise<RoomDto[]> {
    const rooms = await this.redisService.keys('room:*');
    const roomPromises = rooms.map(async (key) => {
      const room = await this.redisService.get(key);
      return JSON.parse(room);
    });
    return Promise.all(roomPromises);
  }

  async createRoom(
    createRoomDto: CreateRoomDto,
    creatorId: string,
  ): Promise<string> {
    const roomId = uuidv4();
    const room: RoomDto = {
      id: roomId,
      ...createRoomDto,
      participants: 1,
      maxParticipants: 2, // 최대 참여자수
      creatorId,
    };

    await this.redisService.set(`room:${roomId}`, JSON.stringify(room));

    return roomId;
  }

  async getRoom(id: string): Promise<RoomDto> {
    const room = await this.redisService.get(`room:${id}`);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return JSON.parse(room);
  }

  async joinRoom(id: string, name: string | null): Promise<void> {
    if (!name) {
      name = uuidv4();
    }
    const room = await this.getRoom(id);

    if (room.participants >= room.maxParticipants) {
      throw new ForbiddenException('방이 꽉 찼습니다.');
    }

    room.participants += 1;
    await this.redisService.set(`room:${id}`, JSON.stringify(room));
  }

  async leaveRoom(id: string): Promise<void> {
    const room = await this.getRoom(id);
    room.participants -= 1;
    if (room.participants <= 0) {
      await this.redisService.del(`room:${id}`);
    } else {
      await this.redisService.set(`room:${id}`, JSON.stringify(room));
    }
  }

  async startBattle(id: string, userId: string): Promise<void> {
    const room = await this.getRoom(id);
    if (room.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the room creator can start the battle',
      );
    }
  }
}

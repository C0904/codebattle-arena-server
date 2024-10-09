import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule, AuthModule],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}

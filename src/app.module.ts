import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfig } from './config/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { BattlesModule } from './modules/battles/battles.module';
import { FirebaseAuthMiddleware } from './common/middleware/firebase-auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: EnvConfig.nodeFile,
    }),

    // Custom Module
    AuthModule,
    BattlesModule,
    RedisModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseAuthMiddleware).forRoutes('*');
  }
}

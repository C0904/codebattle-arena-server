import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // 주의: keys 메서드는 대규모 데이터셋에서 성능 문제를 일으킬 수 있습니다.
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  // SCAN 명령어를 사용한 안전한 키 검색 메서드
  async scan(pattern: string): Promise<string[]> {
    const results: string[] = [];
    let cursor = 0;
    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      results.push(...reply.keys);
    } while (cursor !== 0);
    return results;
  }
}

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {  ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { RateLimitGuard } from './common/rate-limit.guard';
import { RbacGuard } from '@common';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: parseInt(config.get<string>('THROTTLE_TTL') ?? '60', 10),
        limit: parseInt(config.get<string>('THROTTLE_LIMIT') ?? '60', 10)
      }]
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get<string>('process.env.REDIS_URL');
        if (redisUrl) {
          return {
            store: await redisStore({ url: redisUrl })
          };
        }
        // Fallback to in-memory cache when REDIS_URL is not provided
        return {};
      }
    }),
    AuthModule,
    UsersModule,
    TicketsModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_GUARD, useClass: RbacGuard }
  ]
})
export class AppModule {}



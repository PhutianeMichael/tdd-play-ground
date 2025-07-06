import Redis, { Redis as RedisClient, RedisOptions } from 'ioredis';
import { injectable } from 'inversify';
import { IRedisService } from '../interfaces/redis.interface';
import env from '../../../../config';
import { logger } from '../../../../server';

@injectable()
export class RedisService implements IRedisService {
    private client: RedisClient;

    constructor() {
        const options: RedisOptions = {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            password: env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                return Math.min(times * 50, 2000);
            },
        };

        this.client = new Redis(options);

        this.client.on('connect', () => {
            logger.info('Connected to Redis');
        });

        this.client.on('error', (error) => {
            logger.error('Redis error:', error);
        });
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.set(key, value, 'EX', ttl);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async disconnect(): Promise<void> {
        await this.client.quit();
    }

    async isHealthy(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            return false;
        }
    }
}

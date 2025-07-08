import RedisMock from 'ioredis-mock';
import { RedisService } from '../../../../../../../shared/infrastructure/redis/services/redis.service';
import { testRedisServiceContract } from '../contracts/redisService.contract';

describe('RedisService', () => {
    let redisService: RedisService;
    const factory = () => redisService;
    const cleanup = async () => await redisService.disconnect();

    beforeAll(() => {
        // Use ioredis-mock for testing
        const mockClient = new RedisMock();
        redisService = new RedisService(mockClient);
    });

    afterAll(async () => {
        await cleanup();
    });

    testRedisServiceContract(factory, cleanup);

    // Additional unit tests for RedisService can be added here if needed
});

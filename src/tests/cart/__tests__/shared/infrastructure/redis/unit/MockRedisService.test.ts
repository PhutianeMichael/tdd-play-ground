import { MockRedisService } from '../mocks/MockRedisService';
import { testRedisServiceContract } from '../contracts/redisService.contract.test';

describe('MockRedisService', () => {
    const mockRedis = new MockRedisService();
    const factory = () => mockRedis;
    const cleanup = async () => await mockRedis.disconnect();

    testRedisServiceContract(factory, cleanup);

    // Additional unit tests for MockRedisService can be added here if needed
});


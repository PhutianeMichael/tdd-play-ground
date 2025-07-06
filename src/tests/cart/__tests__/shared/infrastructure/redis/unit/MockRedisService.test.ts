
import { testRedisServiceContract } from '../contracts/redisService.contract.test';
import {
    RedisServiceMock
} from '../../../../../../shared/infrastructure/redis/__tests__/unit/mocks/RedisService.mock';

describe('MockRedisService', () => {
    const mockRedis = new RedisServiceMock();
    const factory = () => mockRedis;
    const cleanup = async () => await mockRedis.disconnect();

    testRedisServiceContract(factory, cleanup);

    // Additional unit tests for MockRedisService can be added here if needed
});


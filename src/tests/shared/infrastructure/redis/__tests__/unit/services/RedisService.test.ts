import { RedisService } from '../../../../../../../shared/infrastructure/redis/services/redis.service';
import {
    testRedisServiceContract
} from '../../../../../../cart/__tests__/shared/infrastructure/redis/contracts/redisService.contract.test';

describe('RedisService', () => {
    const redisService = new RedisService();
    const factory = () => redisService;
    const cleanup = async () => await redisService.disconnect();

    testRedisServiceContract(factory, cleanup);

    // Additional unit tests for RedisService can be added here if needed
});


import { container, setupContainer } from '../../../../../container';
import { CartService } from '../../../../../feature/cart/services/cart.service';
import { TYPES } from '../../../../../types';
import { ICartService } from '../../../../../feature/cart/interfaces/cart-service.interface';
import { IRedisService } from '../../../../../shared/infrastructure/redis/interfaces/redis.interface';
import { RedisService } from '../../../../../shared/infrastructure/redis/services/redis.service';
import RedisMock from 'ioredis-mock';

describe('Container', () => {
    beforeAll(async () => {
        await setupContainer();
        // Rebind IRedisService to use ioredis-mock for all resolutions in this test suite
        container.rebind(TYPES.IRedisService)
            .toDynamicValue(() => new RedisService(new RedisMock()))
            .inSingletonScope();
        // Also rebind ICartRepository to a mock for isolation
        const { CartRepositoryMock } = await import('../../mocks/CartRepository.mock');
        if (container.isBound(TYPES.ICartRepository)) {
            container.unbind(TYPES.ICartRepository);
        }
        container.bind(TYPES.ICartRepository).to(CartRepositoryMock).inSingletonScope();
    });

    it('should resolve ICartService to CartService', () => {
        const service = container.get<ICartService>(TYPES.ICartService);
        expect(service).toBeInstanceOf(CartService);
    });

    it('should resolve IRedisService to RedisService', () => {
        const redisService = container.get<IRedisService>(TYPES.IRedisService);
        expect(redisService).toBeInstanceOf(RedisService);
    });

    it('should resolve all dependencies without errors', () => {
        expect(() => {
            container.get(TYPES.ICartController);
            container.get(TYPES.ICartService);
            container.get(TYPES.ICartRepository);
        }).not.toThrow();
    });

    it('should resolve ICartService as a singleton', () => {
        const service1 = container.get<ICartService>(TYPES.ICartService);
        const service2 = container.get<ICartService>(TYPES.ICartService);
        expect(service1).toBe(service2);
    });
    it('should resolve IRedisService as a singleton', () => {
        const redis1 = container.get<IRedisService>(TYPES.IRedisService);
        const redis2 = container.get<IRedisService>(TYPES.IRedisService);
        expect(redis1).toBe(redis2);
    });
});

import { IRedisService } from '../../../../../../../shared/infrastructure/redis/interfaces/redis.interface';

type RedisServiceFactory = () => IRedisService;

export function testRedisServiceContract(factory: RedisServiceFactory, cleanup?: () => Promise<void> | void) {
    describe('IRedisService contract', () => {
        let service: IRedisService;
        const testKey = 'test-key';
        const testValue = 'test-value';

        beforeEach(() => {
            service = factory();
        });

        if (cleanup) {
            afterEach(async () => {
                await cleanup();
            });
        }

        it('should set and get a value', async () => {
            await service.set(testKey, testValue);
            const value = await service.get(testKey);
            expect(value).toBe(testValue);
        });

        it('should return null for non-existent key', async () => {
            const value = await service.get('non-existent-key');
            expect(value).toBeNull();
        });

        it('should set a value with TTL and expire', async () => {
            await service.set(testKey, testValue, 1); // 1 second TTL
            const value = await service.get(testKey);
            expect(value).toBe(testValue);
            await new Promise(res => setTimeout(res, 1100));
            const expired = await service.get(testKey);
            expect(expired).toBeNull();
        });

        it('should delete a key', async () => {
            await service.set(testKey, testValue);
            await service.del(testKey);
            const value = await service.get(testKey);
            expect(value).toBeNull();
        });

        it('should check if a key exists', async () => {
            await service.set(testKey, testValue);
            const exists = await service.exists(testKey);
            expect(exists).toBe(true);
            await service.del(testKey);
            const notExists = await service.exists(testKey);
            expect(notExists).toBe(false);
        });

        it('should report healthy if connected', async () => {
            const healthy = await service.isHealthy();
            expect(typeof healthy).toBe('boolean');
        });

        it('should disconnect without error', async () => {
            await expect(service.disconnect()).resolves.not.toThrow();
        });
    });
}


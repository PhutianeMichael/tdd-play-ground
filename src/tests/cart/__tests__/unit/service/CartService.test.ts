import { MockCartRepository } from '../../mocks/MockCartRepository';
import { CartService } from '../../../../../feature/cart/services/cart.service';
import { testCartServiceContract } from '../../contracts/cartService.contract.test';
import { container } from '../../../../../container';
import { TYPES } from '../../../../../types';
import { Cart, CartItem } from '../../../../../feature/cart/entities/cart.entity';
import { MockRedisService } from '../../shared/infrastructure/redis/mocks/MockRedisService';

describe('CartService', () => {
    const mockRepo = new MockCartRepository();
    const mockRedis = new MockRedisService();
    const serviceFactory = () => new CartService(mockRepo, mockRedis);
    const cleanup = async () => mockRepo.clearAll();

    beforeAll(() => {
        container.rebind(TYPES.ICartRepository).toConstantValue(mockRepo);
    });

    testCartServiceContract(serviceFactory, cleanup);

    // Implementation-specific tests
    it('should validate item quantities', async () => {
        const service = serviceFactory();
        await expect(service.addItemToCart('user1', 'P1', 0 ))
            .rejects.toThrow('Invalid quantity');
    });

    it('should create new cart when none exists', async () => {
        const service = serviceFactory();
        const result = await service.addItemToCart('new-user', 'prod1', 1);
        const cart = await mockRepo.getCartById('new-user');
        expect(cart).toBeDefined();
        expect(result.items).toHaveLength(1);
    });

    it('should retrieve all carts', async () => {
        const service = serviceFactory();
        const result = await service.getAllCarts();
        expect(result).toBeTruthy();
    });

    it('should reject invalid quantities', async () => {
        const service = serviceFactory();
        await expect(service.addItemToCart('user1', 'prod1', -1))
            .rejects.toThrow('Quantity must be positive');
    });

    it('should return false for non-existent cart', async () => {

        const service = serviceFactory();
        const result = await service.clearCart('nonexistent');
        expect(result).toBe(false);
    });

    it('should empty cart items', async () => {
        const service = serviceFactory();
        await mockRepo.createCart(new Cart({ items: [new CartItem()] }));
        const result = await service.clearCart('user1');
        expect(result).toBe(true);
        expect((await mockRepo.getCartById('user1'))?.items).toHaveLength(0);
    });

});

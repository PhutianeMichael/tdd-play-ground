import { CartRepositoryMock } from '../../mocks/CartRepository.mock';
import { CartService } from '../../../../../feature/cart/services/cart.service';
import { testCartServiceContract } from '../../contracts/cartService.contract';
import { container } from '../../../../../container';
import { TYPES } from '../../../../../types';
import { Cart, CartItem } from '../../../../../feature/cart/entities/cart.entity';
import {
    RedisServiceMock
} from '../../../../shared/infrastructure/redis/__tests__/unit/mocks/RedisService.mock';
import { ICartRepository } from '../../../../../feature/cart/interfaces/cart-repository.interface';
import { ObjectId } from 'mongodb';

describe('CartService', () => {
    const mockRepo = new CartRepositoryMock();
    const mockRedis = new RedisServiceMock();
    const serviceFactory = () => new CartService(mockRepo, mockRedis);
    const cleanup = async () => mockRepo.clearAll();

    const cartItem: CartItem = {
        _id: new ObjectId(),
        name: 'Test Product Item',
        price: 5,
        productId: new ObjectId().toString(),
        quantity: 10,
        subtotal: 50
    };
    const userId = new ObjectId();

    beforeAll(() => {
        if (container.isBound(TYPES.ICartRepository)) {
            container.unbind(TYPES.ICartRepository);
        }
        container.bind<ICartRepository>(TYPES.ICartRepository).toConstantValue(mockRepo);
    });

    testCartServiceContract(serviceFactory, cleanup);

    // Implementation-specific tests
    it('should validate item quantities', async () => {
        const service = serviceFactory();
        const invalidItem = { ...cartItem, quantity: 0, subtotal: 0 };
        await expect(service.addItemToCart(userId.toString(), invalidItem ))
            .rejects.toThrow('Invalid quantity');
    });

});

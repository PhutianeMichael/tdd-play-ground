import { container } from '../../../../../container';
import { CartService } from '../../../../../feature/cart/services/cart.service';
import { TYPES } from '../../../../../types';
import { ICartService } from '../../../../../feature/cart/interfaces/cart-service.interface';

describe('Container', () => {
    it('should resolve ICartService to CartService', () => {
        const service = container.get<ICartService>(TYPES.ICartService);
        expect(service).toBeInstanceOf(CartService);
    });

    it('should resolve all dependencies without errors', () => {
        expect(() => {
            container.get(TYPES.ICartController);
            container.get(TYPES.ICartService);
            container.get(TYPES.ICartRepository);
        }).not.toThrow();
    });
});

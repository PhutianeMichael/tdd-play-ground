import { ICartService } from '../../../../feature/cart/interfaces/cart-service.interface';

type CartServiceFactory = () => ICartService;

export function testCartServiceContract(factory: CartServiceFactory, cleanup?: () => Promise<void> | void) {
  describe('ICartService contract', () => {
    let service: ICartService;
    const userId = 'user-1';
    const productId = 'prod-1';

    beforeEach(() => {
      service = factory();
    });

    if (cleanup) {
      afterEach(async () => {
        await cleanup();
      });
    }

    it('should create a cart for a user', async () => {
      const cart = await service.createCart(userId);
      expect(cart).toBeDefined();
      expect(cart.userId).toBe(userId);
      expect(Array.isArray(cart.items)).toBe(true);
    });

    it('should add an item to the cart', async () => {
      await service.createCart(userId);
      const cart = await service.addItemToCart(userId, productId, 2);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe(productId);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('should update item quantity in the cart', async () => {
      await service.createCart(userId);
      await service.addItemToCart(userId, productId, 2);
      const cart = await service.updateItemQuantity(userId, productId, 5);
      expect(cart.items[0].quantity).toBe(5);
    });

    it('should remove an item from the cart', async () => {
      await service.createCart(userId);
      await service.addItemToCart(userId, productId, 2);
      const cart = await service.removeItemFromCart(userId, productId);
      expect(cart.items.length).toBe(0);
    });

    it('should clear the cart', async () => {
      await service.createCart(userId);
      await service.addItemToCart(userId, productId, 2);
      await service.clearCart(userId);
      const cart = await service.getCartById(userId);
      expect(cart.items.length).toBe(0);
    });

    it('should get cart items', async () => {
      await service.createCart(userId);
      await service.addItemToCart(userId, productId, 2);
      const cartItems = await service.getCartItems(userId);
      expect(cartItems).toBe(1);
    });
  });
}

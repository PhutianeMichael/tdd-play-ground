import { ICartService } from '../../../../feature/cart/interfaces/cart-service.interface';
import { ObjectId } from 'mongodb';
import { CartItem } from '../../../../feature/cart/entities/cart.entity';

type CartServiceFactory = () => ICartService;

export function testCartServiceContract(factory: CartServiceFactory, cleanup?: () => Promise<void> | void) {
  describe('ICartService contract', () => {
    let cartService: ICartService;
    let userId: string;

    beforeEach(() => {
      cartService = factory();
      userId = new ObjectId().toHexString();
    });

    if (cleanup) {
      afterEach(async () => {
        await cleanup();
      });
    }

    it("should create a cart and retrieve it by userId", async () => {
      const cart = await cartService.createCart({userId});
      const found = await cartService.getCartByUserId(userId);
      expect(found).not.toBeNull();
      expect(found?.userId).toBe(userId);
    });

    it("should add item to cart and calculate total", async () => {
      const cart = await cartService.createCart({userId});
      const item = new CartItem({ productId: "x1", name: "Widget", price: 5, quantity: 3 });
      await cartService.addItemToCart(cart.userId, item);
      const result = await cartService.getCartByCartId(cart.id);
      expect(result?.items.length).toBe(1);
      expect(result?.totalAmount).toBe(15);
    });

    it("should update item quantity in the cart", async () => {
      const userId = new ObjectId().toHexString();

// Step 1: Create cart
      await cartService.createCart({ userId });

// Step 2: Add item
      const item = new CartItem({
        productId: "prod1",
        name: "Product 1",
        quantity: 1,
        price: 10,
      });
      await cartService.addItemToCart(userId, item);

// Step 3: Retrieve the item ID
      const cart = await cartService.getCartByUserId(userId);
      const itemId = cart.items[0]._id.toHexString();

// Step 4: Update item quantity
      const updatedCart = await cartService.updateItemQuantity(userId, itemId, 5);

      expect(updatedCart.items[0].quantity).toBe(5);
      expect(updatedCart.totalAmount).toBe(50);
    });

    it("should remove an item from the cart", async () => {
      await cartService.createCart({ userId });
      await cartService.addItemToCart(userId, {
        productId: "p2",
        name: "To Remove",
        quantity: 1,
        price: 5,
        _id: new ObjectId,
        subtotal: 0,
      });
      const item = (await cartService.getCartByUserId(userId)).items[0];
      const result = await cartService.removeItemFromCart(userId, item._id.toHexString());
      expect(result.items.length).toBe(0);
    });

    it("should clear the cart", async () => {
      await cartService.createCart({ userId });
      await cartService.addItemToCart(userId, {
        productId: "x",
        name: "Clear Me",
        quantity: 1,
        price: 5,
        _id: new ObjectId,
        subtotal: 0,
      });
      const cleared = await cartService.clearCart(userId);
      expect(cleared.items.length).toBe(0);
    });

    it("should delete a cart", async () => {
      const userId = new ObjectId().toHexString();
      const cart = await cartService.createCart({ userId });

      const deleted = await cartService.deleteCart(cart.id);
      expect(deleted).toBe(true);

      await expect(cartService.getCartByCartId(cart.id))
          .rejects.toThrow("Cart not found");
    });
  });
}

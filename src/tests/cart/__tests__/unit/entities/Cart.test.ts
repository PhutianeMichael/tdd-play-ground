import { ObjectId } from 'mongodb';
import { Cart, CartItem } from '../../../../../feature/cart/entities/cart.entity';

describe('CartItem', () => {
    it('should create a CartItem with correct properties', () => {
        const item = new CartItem({
            id: new ObjectId(),
            productId: 'prod-1',
            name: 'Test Product',
            quantity: 2,
            price: 10
        });
        expect(item.productId).toBe('prod-1');
        expect(item.name).toBe('Test Product');
        expect(item.quantity).toBe(2);
        expect(item.price).toBe(10);
    });

    it('should calculate subtotal correctly', () => {
        const item = new CartItem({ price: 15, quantity: 3 });
        expect(item.subtotal).toBe(45);
    });
});

describe('Cart', () => {
    it('should create a Cart with default values', () => {
        const cart = new Cart();
        expect(cart.id).toBeInstanceOf(ObjectId);
        expect(cart.createdAt).toBeInstanceOf(Date);
        expect(cart.updatedAt).toBeInstanceOf(Date);
        expect(cart.userId).toBe('');
        expect(cart.items).toEqual([]);
        expect(cart.totalAmount).toBe(0);
    });

    it('should create a Cart with provided values', () => {
        const now = new Date();
        const cart = new Cart({
            id: new ObjectId(),
            userId: 'user-1',
            items: [new CartItem({ productId: 'prod-1', name: 'Test', quantity: 1, price: 5 })],
            totalAmount: 5,
            createdAt: now,
            updatedAt: now
        });
        expect(cart.userId).toBe('user-1');
        expect(cart.items.length).toBe(1);
        expect(cart.totalAmount).toBe(5);
        expect(cart.createdAt).toBe(now);
        expect(cart.updatedAt).toBe(now);
    });
});


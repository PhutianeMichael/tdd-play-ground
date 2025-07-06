import { ICartRepository } from '../../../../feature/cart/interfaces/cart-repository.interface';
import { Cart, CartItem } from '../../../../feature/cart/entities/cart.entity';
import {  ObjectId } from 'mongodb';

export class MockCartRepository implements ICartRepository {
    private carts: Map<string, Cart> = new Map();
    cartData: Cart = {
        id: new ObjectId(),
        createdAt: new Date(),
        items: [],
        totalAmount: 0,
        updatedAt: new Date(),
        userId: new ObjectId().toString()
    }
    emptyCartData: Cart = {
        id: new ObjectId(),
        createdAt: new Date(),
        items: [],
        totalAmount: 0,
        updatedAt: new Date(),
        userId: new ObjectId().toString()
    }

    async createCart(id: string, cart: Cart): Promise<Cart> {
        this.carts.set(id, cart);
        return cart;
    }
    async addItemToCart(id: string, item: CartItem): Promise<boolean> {
        let cart = this.carts.get(id);
        if (!cart) {
            cart = this.createEmptyCart(id);
            this.carts.set(id, cart);
        }
        cart.items = cart.items || [];
        cart.items.push(item);
        return cart.items.includes(item);
    }
    async getCartById(id: string): Promise<Cart | null> {
        return this.carts.get(id) || null;
    }
    async updateCart(id: string, cart: Cart): Promise<Cart | null> {
        this.carts.set(id, cart);
        return this.carts.get(id)?? null;
    }
    async removeItemFromCart(id: string, itemId: string): Promise<boolean> {
        const cart = this.carts.get(id);
        if (!cart || !cart.items) {
            return false;
        }

        cart.items = cart.items.filter(item => item.id !== new ObjectId(itemId));
        return !cart.items.some(item => item.id === new ObjectId(itemId));
    }
    async clearCart(id: string): Promise<boolean> {
        const cart = this.carts.get(id);
        if (!cart) {
            return false;
        }

        cart.items = [];
        return cart.items.length === 0;
    }
    async deleteCart(id: string): Promise<boolean> {
        return this.carts.delete(id);
    }
    async getCartItems(id: string): Promise<CartItem[]> {
        const cart = this.carts.get(id);
        if (!cart) {
            return Promise.resolve([]);
        }
        return Promise.resolve(cart.items);
    }

    async getAll(): Promise<Cart[]> {
        return this.carts.size > 0 ? Array.from(this.carts.values()) : [this.emptyCartData];
    }
    async clearAll(): Promise<void> {
        this.carts.clear();
    }
    // Private helper
    private createEmptyCart(userId: string): Cart {
        return this.emptyCartData;
    }
}

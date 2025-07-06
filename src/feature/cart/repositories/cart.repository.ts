import { injectable } from 'inversify';
import { ICartRepository } from '../interfaces/cart-repository.interface';
import { Cart, CartItem } from '../entities/cart.entity';
import { Db, Collection } from 'mongodb';

@injectable()
export class CartRepository implements ICartRepository {
    private collection: Collection<Cart>;
    constructor(db: Db) {
        this.collection = db.collection<Cart>('carts');
    }
    async addItemToCart(id: string, item: CartItem): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async clearCart(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async createCart(cart: Cart): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async deleteCart(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async getCartById(id: string): Promise<Cart | null> {
        throw new Error('Method not implemented.');
    }
    async removeItemFromCart(id: string, itemId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async updateCart(id: string, cart: Cart): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async getCartItems(id: string): Promise<CartItem[]> {
        throw new Error('Method not implemented.');
    }
    async getAll(): Promise<Cart[]> {
        throw new Error('Method not implemented.');
    }
    async clearAll(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

import { Cart, CartItem } from '../entities/cart.entity';

export interface ICartService {
    createCart(id: string): Promise<Cart>;
    addItemToCart(id: string, itemId: string, quantity: number): Promise<Cart>;
    getCartById(id: string): Promise<Cart>;
    updateItemQuantity(id: string, itemId: string, quantity: number): Promise<Cart>;
    removeItemFromCart(id: string, itemId: string): Promise<Cart>;
    clearCart(id: string): Promise<boolean>;
    deleteCart(id: string): Promise<boolean>;
    getAllCarts(): Promise<Cart[]>;
    getCartItems(id: string): Promise<CartItem[]>;
}

import { Cart, CartItem } from '../entities/cart.entity';

export interface ICartRepository {
    createCart(id: string, cart: Cart): Promise<Cart>;
    addItemToCart(id: string, item: CartItem): Promise<boolean>;
    getCartById(id: string): Promise<Cart | null>;
    updateCart(id: string, cart: Cart): Promise<Cart | null>;
    removeItemFromCart(id: string, itemId: string): Promise<boolean>;
    clearCart(id: string): Promise<boolean>;
    deleteCart(id: string): Promise<boolean>;
    getCartItems(id: string): Promise<CartItem[]>;
    getAll(): Promise<Cart[]>;
    clearAll(): Promise<void>;
}

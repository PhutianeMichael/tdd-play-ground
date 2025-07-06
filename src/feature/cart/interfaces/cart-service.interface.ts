import { Cart } from '../entities/cart.entity';
import { CartItemResponse, CartResponse } from '../dto/cart-response.dto';

export interface ICartService {
    createCart(id: string): Promise<Cart>;
    addItemToCart(id: string, itemId: string, quantity: number): Promise<Cart>;
    getCartById(id: string): Promise<Cart>;
    updateItemQuantity(id: string, itemId: string, quantity: number): Promise<Cart>;
    removeItemFromCart(id: string, itemId: string): Promise<boolean>;
    clearCart(id: string): Promise<boolean>;
    deleteCart(id: string): Promise<boolean>;
    getAllCarts(): Promise<CartResponse[]>;
    getCartItems(id: string): Promise<CartItemResponse[]>;
}

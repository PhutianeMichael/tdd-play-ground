import { CartItem } from '../entities/cart.entity';

export interface CartResponse {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    updatedAt: string;
    createdAt: string;
}

export interface CartItemResponse {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

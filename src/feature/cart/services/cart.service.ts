import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { ICartService } from '../interfaces/cart-service.interface';
import { Cart } from '../entities/cart.entity';
import { ICartRepository } from '../interfaces/cart-repository.interface';
import { CartItemResponse, CartResponse } from '../dto/cart-response.dto';
import { IRedisService } from '../../../shared/infrastructure/redis/interfaces/redis.interface';

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(TYPES.ICartRepository) private readonly cartRepository: ICartRepository,
        @inject(TYPES.IRedisService) private readonly redisService: IRedisService
    ) {
    }

    addItemToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
        throw new Error('Not implemented');
    }

    clearCart(userId: string): Promise<boolean> {
        throw new Error('Not implemented');
    }

    createCart(userId: string): Promise<Cart> {
        throw new Error('Not implemented');
    }

    getCartById(userId: string): Promise<Cart> {
        throw new Error('Not implemented');
    }

    getCartItems(userId: string): Promise<CartItemResponse[]> {
        throw new Error('Not implemented');
    }

    getAllCarts(): Promise<CartResponse[]> {
        throw new Error('Not implemented');
    }

    removeItemFromCart(userId: string, productId: string): Promise<boolean> {
        throw new Error('Not implemented');
    }

    updateItemQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
        throw new Error('Not implemented');
    }

    deleteCart(id: string): Promise<boolean> {
        throw new Error('Not implemented');
    }

}

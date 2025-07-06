import { Request, Response } from 'express';
import { ICartController } from '../../../../feature/cart/interfaces/cart-controller.interface';
import { CartResponse } from '../../../../feature/cart/dto/cart-response.dto';

export class CartControllerMock implements ICartController {
    async createCart(req: Request, res: Response): Promise<CartResponse> {
        throw new Error('Not implemented');
    }
    async addItemToCart(req: Request, res: Response): Promise<void> {
        throw new Error('Not implemented');
    }
    async removeItemFromCart(req: Request, res: Response): Promise<void> {
        throw new Error('Not implemented');
    }
    async updateItemQuantity(req: Request, res: Response): Promise<void> {
        throw new Error('Not implemented');
    }
    async getCartByUserId(req: Request, res: Response): Promise<void> {
        throw new Error('Not implemented');
    }
    async getCartItems(req: Request, res: Response): Promise<void> {
        throw new Error('Not implemented');
    }
    async clearCart(req: Request, res: Response): Promise<void> {
        throw new Error('Not implemented');
    }
}


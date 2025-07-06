import {
    controller, httpGet, httpPatch, httpPost, httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { ICartService } from '../interfaces/cart-service.interface';
import { Request, Response } from 'express';
import { ICartController } from '../interfaces/cart-controller.interface';
import { CartResponse } from '../dto/cart-response.dto';

@controller('/cart')
export class CartController implements ICartController {
    constructor(
        @inject(TYPES.ICartService) private cartService: ICartService
    ) {}

    @httpPost('/')
    async createCart(req: Request, res: Response): Promise<CartResponse> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }

    @httpPost('/:id/add')
    async addItemToCart(req: Request, res: Response): Promise<void> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }

    @httpPut('/:id/remove')
    async removeItemFromCart(req: Request, res: Response): Promise<void> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }

    @httpPut('/:id/quantity')
    async updateItemQuantity(req: Request, res: Response): Promise<void> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }

    @httpGet('/userId/:id')
    async getCartByUserId(req: Request, res: Response): Promise<void> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }

    @httpGet('/:id/items')
    async getCartItems(req: Request, res: Response): Promise<void> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }

    @httpPut('/:id/clear')
    async clearCart(req: Request, res: Response): Promise<void> {
        // TODO: Implement
        throw new Error('Method not implemented.');
    }
}

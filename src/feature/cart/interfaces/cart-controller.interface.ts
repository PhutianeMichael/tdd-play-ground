import { Request, Response } from 'express';
import { CartResponse } from '../dto/cart-response.dto';

export interface ICartController {
    createCart(req: Request, res: Response): Promise<CartResponse>;
    addItemToCart(req: Request, res: Response): Promise<void>;
    removeItemFromCart(req: Request, res: Response): Promise<void>;
    updateItemQuantity(req: Request, res: Response): Promise<void>;
    getCartByUserId(req: Request, res: Response): Promise<void>;
    getCartItems(req: Request, res: Response): Promise<void>;
    clearCart(req: Request, res: Response): Promise<void>;
}


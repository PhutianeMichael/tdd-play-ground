import { Request, Response } from 'express';
import { ICartController } from '../../../../feature/cart/interfaces/cart-controller.interface';
import { CartControllerMock } from '../mocks/CartController.mock';
import { ObjectId } from 'mongodb';

type CartControllerFactory = () => ICartController;

export function testCartControllerContract(factory: CartControllerFactory, cleanup?: () => Promise<void> | void) {
    describe('ICartController contract', () => {
        let controller: ICartController;
        let req: Partial<Request>;
        let res: Partial<Response>;
        let statusCode: number | undefined;
        let jsonResponse: any;
        const cartId = new ObjectId().toString();
        const userId = new ObjectId().toString();
        const itemId = new ObjectId().toString();
        const productId = new ObjectId().toString();
        const item = { id: itemId, productId, name: 'Test Item', quantity: 1, price: 10 };
        const cart = {
            id: cartId,
            userId,
            items: [item]
        };
        // Add mockCartService for side effect assertions
        let mockCartService: any;

        beforeEach(() => {
            controller = factory();
            statusCode = undefined;
            jsonResponse = undefined;
            req = {};
            res = {
                status: (code: number) => {
                    statusCode = code;
                    return res as Response;
                },
                json: (data: any) => {
                    jsonResponse = data;
                    return res as Response;
                }
            };
        });

        if (cleanup) {
            afterEach(async () => {
                await cleanup();
            });
        }

        it('should implement createCart', async () => {
            req.body = { userId };
            const expectedResponse = { cartId, userId, items: [] };
            await controller.createCart(req as Request, res as Response);
            expect(statusCode).toBe(201); // or the expected status
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.createCart).toHaveBeenCalledWith(userId);
        });

        it('should implement addItemToCart', async () => {
            req.body = { userId, item: { id: itemId, quantity: 2 } };
            const expectedResponse = { cartId, userId, items: [{ id: itemId, quantity: 2 }] };
            await controller.addItemToCart(req as Request, res as Response);
            expect(statusCode).toBe(200); // or the expected status
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.addItemToCart).toHaveBeenCalledWith(userId, { id: itemId, quantity: 2 });
        });

        it('should implement removeItemFromCart', async () => {
            req.body = { userId, itemId };
            const expectedResponse = { cartId, userId, items: [] };
            await controller.removeItemFromCart(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.removeItemFromCart).toHaveBeenCalledWith(userId, itemId);
        });

        it('should implement updateItemQuantity', async () => {
            req.body = { userId, itemId, quantity: 3 };
            const expectedResponse = { cartId, userId, items: [{ id: itemId, quantity: 3 }] };
            await controller.updateItemQuantity(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(userId, itemId, 3);
        });

        it('should implement getCartById', async () => {
            req.params = { userId };
            const expectedResponse = { cartId, userId, items: [] };
            await controller.getCartByUserId(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.getCartByUserId).toHaveBeenCalledWith(userId);
        });

        it('should implement getCartItems', async () => {
            req.params = { userId };
            const expectedResponse = [{ id: itemId, quantity: 2 }];
            await controller.getCartItems(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.getCartItems).toHaveBeenCalledWith(userId);
        });

        it('should implement clearCart', async () => {
            req.body = { userId};
            const expectedResponse = { cartId, userId, items: [] };
            await controller.clearCart(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.clearCart).toHaveBeenCalledWith(userId);
        });
    });
}

testCartControllerContract(() => new CartControllerMock());

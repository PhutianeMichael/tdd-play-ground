import { Request, Response } from 'express';
import { ICartController } from '../../../../feature/cart/interfaces/cart-controller.interface';
import { ICartService } from '../../../../feature/cart/interfaces/cart-service.interface';

type ControllerFactory = (service: ICartService) => ICartController;

export function testCartControllerContract(factory: ControllerFactory) {
    describe('ICartController contract', () => {
        let controller: ICartController;
        let req: Partial<Request>;
        let res: Partial<Response>;
        let statusCode: number | undefined;
        let jsonResponse: any;
        // Add mockCartService for side effect assertions
        let mockCartService: any;

        beforeEach(() => {
            // Create a mockCartService with Jest mock functions
            mockCartService = {
                createCart: jest.fn().mockResolvedValue({ cartId: 'cart1', userId: 'user1', items: [] }),
                addItemToCart: jest.fn().mockResolvedValue({ cartId: 'cart1', userId: 'user1', items: [{ id: 'item1', quantity: 2 }] }),
                removeItemFromCart: jest.fn().mockResolvedValue({ cartId: 'cart1', userId: 'user1', items: [] }),
                updateItemQuantity: jest.fn().mockResolvedValue({ cartId: 'cart1', userId: 'user1', items: [{ id: 'item1', quantity: 3 }] }),
                getCartByUserId: jest.fn().mockResolvedValue({ cartId: 'cart1', userId: 'user1', items: [] }),
                getCartItems: jest.fn().mockResolvedValue([{ id: 'item1', quantity: 2 }]),
                clearCart: jest.fn().mockResolvedValue({ cartId: 'cart1', userId: 'user1', items: [] })
            };
            // Pass the mockCartService to the controller factory if supported
            controller = factory(mockCartService);
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

        it('should implement createCart', async () => {
            req.body = { userId: 'user1' };
            const expectedResponse = { cartId: 'cart1', userId: 'user1', items: [] };
            await controller.createCart(req as Request, res as Response);
            expect(statusCode).toBe(201); // or the expected status
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.createCart).toHaveBeenCalledWith('user1');
        });

        it('should implement addItemToCart', async () => {
            req.body = { userId: 'user1', item: { id: 'item1', quantity: 2 } };
            const expectedResponse = { cartId: 'cart1', userId: 'user1', items: [{ id: 'item1', quantity: 2 }] };
            await controller.addItemToCart(req as Request, res as Response);
            expect(statusCode).toBe(200); // or the expected status
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.addItemToCart).toHaveBeenCalledWith('user1', { id: 'item1', quantity: 2 });
        });

        it('should implement removeItemFromCart', async () => {
            req.body = { userId: 'user1', itemId: 'item1' };
            const expectedResponse = { cartId: 'cart1', userId: 'user1', items: [] };
            await controller.removeItemFromCart(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.removeItemFromCart).toHaveBeenCalledWith('user1', 'item1');
        });

        it('should implement updateItemQuantity', async () => {
            req.body = { userId: 'user1', itemId: 'item1', quantity: 3 };
            const expectedResponse = { cartId: 'cart1', userId: 'user1', items: [{ id: 'item1', quantity: 3 }] };
            await controller.updateItemQuantity(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith('user1', 'item1', 3);
        });

        it('should implement getCartById', async () => {
            req.params = { userId: 'user1' };
            const expectedResponse = { cartId: 'cart1', userId: 'user1', items: [] };
            await controller.getCartByUserId(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.getCartByUserId).toHaveBeenCalledWith('user1');
        });

        it('should implement getCartItems', async () => {
            req.params = { userId: 'user1' };
            const expectedResponse = [{ id: 'item1', quantity: 2 }];
            await controller.getCartItems(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.getCartItems).toHaveBeenCalledWith('user1');
        });

        it('should implement clearCart', async () => {
            req.body = { userId: 'user1' };
            const expectedResponse = { cartId: 'cart1', userId: 'user1', items: [] };
            await controller.clearCart(req as Request, res as Response);
            expect(statusCode).toBe(200);
            expect(jsonResponse).toEqual(expectedResponse);
            // Side effect: service method called
            expect(mockCartService.clearCart).toHaveBeenCalledWith('user1');
        });
    });
}

import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';
import { ICartRepository } from '../../../../feature/cart/interfaces/cart-repository.interface';
import { CartRepository } from '../../../../feature/cart/repositories/cart.repository';

let mongod: MongoMemoryServer;
let client: MongoClient;
let db: Db;

// Factory for CartRepository using mongodb-memory-server
export const cartRepositoryFactory = () => new CartRepository(db);

// Optional cleanup to flush the in-memory MongoDB after each test
export const cleanup = async () => {
    await db.collection('carts').deleteMany({});
};

type CartRepositoryFactory = () => ICartRepository;

export function testCartRepositoryContract(factory: CartRepositoryFactory, cleanup?: () => Promise<void> | void) {
    describe('ICartRepository contract', () => {
        let repo: ICartRepository;
        const userId = 'user-1';
        const productId = 'prod-1';

        beforeEach(() => {
            repo = factory();
        });

        if (cleanup) {
            afterEach(async () => {
                await cleanup();
            });
        }

        it('should create and retrieve a cart by userId', async () => {
            const cart = await repo.createCart({ id: 'cart-1', userId, items: [] } as any);
            expect(cart).toBeDefined();
            const found = await repo.getCartById(userId);
            expect(found).not.toBeNull();
            expect(found!.userId).toBe(userId);
        });

        it('should update a cart', async () => {
            await repo.createCart({ id: 'cart-1', userId, items: [] } as any);
            const updatedCart = { id: 'cart-1', userId, items: [{ id: 'item-1', productId, name: 'Test', quantity: 1, price: 10 }] } as any;
            const result = await repo.updateCart(userId, updatedCart);
            expect(result).toBeTruthy();
            const found = await repo.getCartById(userId);
            expect(found!.items.length).toBe(1);
        });

        it('should delete a cart', async () => {
            await repo.createCart({ id: 'cart-1', userId, items: [] } as any);
            const result = await repo.deleteCart(userId);
            expect(result).toBeTruthy();
            const found = await repo.getCartById(userId);
            expect(found).toBeNull();
        });

        it('should add and remove an item from the cart', async () => {
            await repo.createCart({ id: 'cart-1', userId, items: [] } as any);
            const item = { id: 'item-1', productId, name: 'Test', quantity: 1, price: 10 } as any;
            await repo.addItemToCart(userId, item);
            let found = await repo.getCartById(userId);
            expect(found!.items.length).toBe(1);
            await repo.removeItemFromCart(userId, 'item-1');
            found = await repo.getCartById(userId);
            expect(found!.items.length).toBe(0);
        });

        it('should clear the cart', async () => {
            await repo.createCart({ id: 'cart-1', userId, items: [] } as any);
            const item = { id: 'item-1', productId, name: 'Test', quantity: 1, price: 10 } as any;
            await repo.addItemToCart(userId, item);
            await repo.clearCart(userId);
            const found = await repo.getCartById(userId);
            expect(found!.items.length).toBe(0);
        });

    });

}

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('testdb');
});

afterAll(async () => {
    await client.close();
    await mongod.stop();
});

testCartRepositoryContract(cartRepositoryFactory, cleanup);

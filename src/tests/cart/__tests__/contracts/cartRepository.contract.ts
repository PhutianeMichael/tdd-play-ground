import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { ICartRepository } from '../../../../feature/cart/interfaces/cart-repository.interface';
import { CartRepository } from '../../../../feature/cart/repositories/cart.repository';
import { CartItem } from '../../../../feature/cart/entities/cart.entity';

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
        let userId: string;

        beforeEach(() => {
            repo = factory();
            userId = new ObjectId().toHexString();
        });

        if (cleanup) {
            afterEach(async () => {
                await cleanup();
            });
        }

        it("should create and retrieve a cart by userId and id", async () => {
            const created = await repo.createCart({ userId });
            const byUserId = await repo.getCartByUserId(userId);
            const byId = await repo.getCartByCartId(created._id.toString());
            expect(byUserId?._id.toHexString()).toBe(created._id.toHexString());
            expect(byId?._id.toHexString()).toBe(created._id.toHexString());
        });

        it("should add an item to a cart", async () => {
            await repo.createCart({ userId });
            const item = new CartItem({ productId: "prod1", name: "Test Product", price: 10, quantity: 2 });
            const updated = await repo.addItemToCart(userId, item);
            expect(updated?.items.length).toBe(1);
            expect(updated?.totalAmount).toBe(20);
        });

        it("should update item quantity in a cart", async () => {
            await repo.createCart({ userId });
            const item = new CartItem({ productId: "prod1", name: "Test Product", price: 5, quantity: 1 });
            const cart = await repo.addItemToCart(userId, item);
            const updated = await repo.updateItemQuantity(userId, cart!.items[0]._id.toHexString(), 3);
            expect(updated?.items[0].quantity).toBe(3);
            expect(updated?.totalAmount).toBe(15);
        });

        it("should remove an item from a cart", async () => {
            await repo.createCart({ userId });
            const item = new CartItem({ productId: "prod2", name: "Remove Me", price: 7, quantity: 1 });
            const cart = await repo.addItemToCart(userId, item);
            const updated = await repo.removeItemFromCart(userId, cart!.items[0]._id.toHexString());
            expect(updated?.items.length).toBe(0);
        });

        it("should clear a cart", async () => {
            await repo.createCart({ userId });
            await repo.addItemToCart(userId, new CartItem({ productId: "x", name: "X", quantity: 1, price: 1 }));
            const cleared = await repo.clearCart(userId);
            expect(cleared?.items.length).toBe(0);
            expect(cleared?.totalAmount).toBe(0);
        });

        it("should delete a cart", async () => {
            const cart = await repo.createCart({userId});
            const deleted = await repo.deleteCart(cart?._id.toString());
            expect(deleted).toBe(true);
            const after = await repo.getCartByCartId(cart._id.toString());
            expect(after).toBeNull();
        });

        it("should get all carts", async () => {
            await repo.createCart({ userId });
            await repo.createCart({ userId: new ObjectId().toHexString() });
            const all = await repo.getAllCarts();
            expect(all.length).toBe(2);
        });

        it("should clear all carts", async () => {
            await repo.createCart({ userId });
            await repo.createCart({ userId: new ObjectId().toHexString() });
            await repo.clearAll();
            const all = await repo.getAllCarts();
            expect(all.length).toBe(0);
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

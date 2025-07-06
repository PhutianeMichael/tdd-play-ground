import { Container } from 'inversify';
import { connectToMongoDB } from './mongodb';
import { TYPES } from './types';
import { CartRepository } from './feature/cart/repositories/cart.repository';
import { ICartRepository } from './feature/cart/interfaces/cart-repository.interface';
import { CartService } from './feature/cart/services/cart.service';
import { ICartService } from './feature/cart/interfaces/cart-service.interface';
import { CartController } from './feature/cart/controllers/cart.controller';
import { IRedisService } from './shared/infrastructure/redis/interfaces/redis.interface';
import { RedisService } from './shared/infrastructure/redis/services/redis.service';

export const container = new Container({
    defaultScope: 'Singleton', // Set default scope for all bindings
    skipBaseClassChecks: true // Optional: prevents unnecessary checks
});

export async function setupContainer() {
    const db = await connectToMongoDB();
    // Repository Binding (explicit type)
    container
        .bind<ICartRepository>(TYPES.ICartRepository)
        .toDynamicValue(() => new CartRepository(db))
        .inSingletonScope();

    // Redis Service Binding (explicit type)
    container
        .bind<IRedisService>(TYPES.IRedisService)
        .to(RedisService)
        .inSingletonScope();

    // Service Binding (explicit type and dependencies)
    container
        .bind<ICartService>(TYPES.ICartService)
        .toDynamicValue(ctx => new CartService(
            ctx.container.get<ICartRepository>(TYPES.ICartRepository),
            ctx.container.get<IRedisService>(TYPES.IRedisService)
        ))
        .inSingletonScope();

    // Controller Binding (explicit type)
    container
        .bind<CartController>(TYPES.ICartController) // Note: Binding to concrete class
        .to(CartController)
        .inSingletonScope();
}

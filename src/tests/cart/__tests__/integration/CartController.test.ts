import { CartController } from '../../../../feature/cart/controllers/cart.controller';
import { testCartControllerContract } from '../contracts/cartController.contract';
import { CartService } from '../../../../feature/cart/services/cart.service';
import { CartRepositoryMock } from '../mocks/CartRepository.mock';
import { RedisServiceMock } from '../../../shared/infrastructure/redis/__tests__/unit/mocks/RedisService.mock';

// Provide a zero-argument factory that constructs all dependencies
const factory = () => {
    const repo = new CartRepositoryMock();
    const redis = new RedisServiceMock();
    const service = new CartService(repo, redis);
    return new CartController(service);
};

testCartControllerContract(factory);


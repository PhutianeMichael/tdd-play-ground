import { CartController } from '../../../../feature/cart/controllers/cart.controller';
import { testCartControllerContract } from '../contracts/cartController.contract.test';
import { ICartService } from '../../../../feature/cart/interfaces/cart-service.interface';

testCartControllerContract((service: ICartService) => new CartController(service));


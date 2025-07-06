import { CartRepositoryMock } from '../../mocks/CartRepository.mock';
import { testCartRepositoryContract } from '../../contracts/cartRepository.contract';

describe('CartRepositoryMock', () => {
    const mockRepo = new CartRepositoryMock();
    const repoFactory = () => mockRepo;
    const cleanup = async () => mockRepo.clearAll();

    testCartRepositoryContract(repoFactory, cleanup);


});


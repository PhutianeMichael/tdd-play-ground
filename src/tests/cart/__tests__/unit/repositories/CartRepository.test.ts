import { MockCartRepository } from '../../mocks/MockCartRepository';
import { testCartRepositoryContract } from '../../contracts/cartRepository.contract.test';

describe('MockCartRepository', () => {
    const mockRepo = new MockCartRepository();
    const repoFactory = () => mockRepo;
    const cleanup = async () => mockRepo.clearAll();

    testCartRepositoryContract(repoFactory, cleanup);


});


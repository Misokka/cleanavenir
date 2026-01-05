// Services/Adapters
import { SimplePasswordHasher } from '../adapters/SimplePasswordHasher';
import { ProfileManager } from '../../application/ports/services/ProfileFetcher';

// Use Cases - Auth
import { RegisterUseCase } from '../../application/use-cases/user/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/user/auth/LoginUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/user/auth/GetUserProfileUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/user/auth/RefreshTokenUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/user/auth/ResetPasswordUseCase';

// Use Cases - Account
import { GetBankAccountUseCase } from '../../application/use-cases/client/account/GetBankAccountUseCase';
import { ListUserBankAccountsUseCase } from '../../application/use-cases/client/account/ListUserBankAccountsUseCase';
import { CreateBankAccountUseCase } from '../../application/use-cases/client/account/CreateBankAccountUseCase';
import { RenameBankAccountUseCase } from '../../application/use-cases/client/account/RenamebankAccountUseCase';
import { DeleteBankAccountUseCase } from '../../application/use-cases/client/account/DeleteBankAccountUseCase';

// Use Cases - Operation
import { ListAccountOperationsUseCase } from '../../application/use-cases/client/transaction/ListAccountTransactionsUseCase';
import { ListRecentOperationsUseCase } from '../../application/use-cases/client/transaction/ListRecentTransactionsUseCase';
import { TransferUseCase } from '../../application/use-cases/client/transaction/TransferUseCase';
import { GetOperationsHistoryUseCase } from '../../application/use-cases/client/transaction/GetTransactionsHistoryUseCase';

// Use Cases - Saving
import { ListUserSavingsUseCase } from '../../application/use-cases/client/saving/ListUserSavingsUseCase';
import { CreateSavingAccountUseCase } from '../../application/use-cases/client/saving/CreateSavingAccountUseCase';
import { ApplyDailyInterestUseCase } from '../../application/use-cases/client/saving/ApplyDailyInterestUseCase';
import { GetCurrentSavingRateUseCase } from '../../application/use-cases/client/saving/GetCurrentSavingRateUseCase';



// Repositories Prisma
import { PrismaAdvisorRepository } from '../repositories/prisma/PrismaAdvisorRepository';
import { PrismaBankAccountRepository } from '../repositories/prisma/PrismaBankAccountRepository';
import { PrismaBeneficiaryRepository } from '../repositories/prisma/PrismaBeneficiaryRepository';
import { PrismaClientRepository } from '../repositories/prisma/PrismaClientRepository';
import { PrismaCompanyRepository } from '../repositories/prisma/PrismaCompanyRepository';
import { PrismaDirectorRepository } from '../repositories/prisma/PrismaDirectorRepository';
import { PrismaDiscussionRepository } from '../repositories/prisma/PrismaDiscussionRepository';
import { PrismaHoldingRepository } from '../repositories/prisma/PrismaHoldingRepository';
import { PrismaLoanRepository } from '../repositories/prisma/PrismaLoanRepository';
import { PrismaPortfolioRepository } from '../repositories/prisma/PrismaPortfolioRepository';
import { PrismaSavingAccountRepository } from '../repositories/prisma/PrismaSavingAccountRepository';
import { PrismaSavingProductRepository } from '../repositories/prisma/PrismaSavingProductRepository';
import { PrismaStockRepository } from '../repositories/prisma/PrismaStockRepository';
import { PrismaTradeRepository } from '../repositories/prisma/PrismaTradeRepository';
import { PrismaTransactionRepository } from '../repositories/prisma/PrismaTransactionRepository';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';

// Mappers
import { PrismaAdvisorMapper } from '../repositories/mappers/PrismaMappers/PrismaAdvisorMapper';
import { PrismaBankAccountMapper } from '../repositories/mappers/PrismaMappers/PrismaBankAccountMapper';
import { PrismaBeneficiaryMapper } from '../repositories/mappers/PrismaMappers/PrismaBeneficiaryMapper';
import { PrismaClientMapper } from '../repositories/mappers/PrismaMappers/PrismaClientMapper';
import { PrismaCompanyMapper } from '../repositories/mappers/PrismaMappers/PrismaCompanyMapper';
import { PrismaDirectorMapper } from '../repositories/mappers/PrismaMappers/PrismaDirectorMapper';
import { PrismaDiscussionMapper } from '../repositories/mappers/PrismaMappers/PrismaDiscussionMapper';
import { PrismaHoldingMapper } from '../repositories/mappers/PrismaMappers/PrismaHoldingMapper';
import { PrismaLoanMapper } from '../repositories/mappers/PrismaMappers/PrismaLoanMapper';
import { PrismaPortfolioMapper } from '../repositories/mappers/PrismaMappers/PrismaPortfolioMapper';
import { PrismaSavingAccountMapper } from '../repositories/mappers/PrismaMappers/PrismaSavingAccountMapper';
import { PrismaSavingProductMapper } from '../repositories/mappers/PrismaMappers/PrismaSavingProductMapper';
import { PrismaStockMapper } from '../repositories/mappers/PrismaMappers/PrismaStockMapper';
import { PrismaTradeMapper } from '../repositories/mappers/PrismaMappers/PrismaTradeMapper';
import { PrismaTransactionMapper } from '../repositories/mappers/PrismaMappers/PrismaTransactionMapper';
import { PrismaUserMapper } from '../repositories/mappers/PrismaMappers/PrismaUserMapper';
import { PrismaClient } from '@prisma/client';

export function createPrismaContainer() {

  const prismaClient = new PrismaClient();

  const userMapper = new PrismaUserMapper();
  const clientMapper = new PrismaClientMapper();
  const directorMapper = new PrismaDirectorMapper();
  const advisorMapper = new PrismaAdvisorMapper();
  const bankAccountMapper = new PrismaBankAccountMapper();
  const beneficiaryMapper = new PrismaBeneficiaryMapper();
  const loanMapper = new PrismaLoanMapper();
  const savingAccountMapper = new PrismaSavingAccountMapper();
  const savingProductMapper = new PrismaSavingProductMapper();
  const stockMapper = new PrismaStockMapper();
  const transactionMapper = new PrismaTransactionMapper();
  const tradeMapper = new PrismaTradeMapper();
  const portfolioMapper = new PrismaPortfolioMapper();
  const holdingMapper = new PrismaHoldingMapper();
  const companyMapper = new PrismaCompanyMapper();
  const discussionMapper = new PrismaDiscussionMapper();

  const userRepository = new PrismaUserRepository(prismaClient, userMapper);
  const clientRepository = new PrismaClientRepository(prismaClient, clientMapper);
  const directorRepository = new PrismaDirectorRepository(prismaClient, directorMapper);
  const advisorRepository = new PrismaAdvisorRepository(prismaClient, advisorMapper);
  const bankAccountRepository = new PrismaBankAccountRepository(prismaClient, bankAccountMapper);
  const beneficiaryRepository = new PrismaBeneficiaryRepository(prismaClient, beneficiaryMapper);
  const loanRepository = new PrismaLoanRepository(prismaClient, loanMapper);
  const savingAccountRepository = new PrismaSavingAccountRepository(prismaClient, savingAccountMapper);
  const savingProductRepository = new PrismaSavingProductRepository(prismaClient, savingProductMapper);
  const stockRepository = new PrismaStockRepository(prismaClient, stockMapper);
  const transactionRepository = new PrismaTransactionRepository(prismaClient, transactionMapper);
  const tradeRepository = new PrismaTradeRepository(prismaClient, tradeMapper);
  const portfolioRepository = new PrismaPortfolioRepository(prismaClient, portfolioMapper);
  const holdingRepository = new PrismaHoldingRepository(prismaClient, holdingMapper);
  const companyRepository = new PrismaCompanyRepository(prismaClient, companyMapper);
  const discussionRepository = new PrismaDiscussionRepository(prismaClient, discussionMapper);

  const passwordHasher = new SimplePasswordHasher();

  const profileManager = new ProfileManager(
    clientRepository,
    directorRepository,
    advisorRepository
  );
  
  const registerUseCase = new RegisterUseCase(
    userRepository,
    profileManager,
    passwordHasher
  );

  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordHasher,
    profileManager
  );

  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, profileManager);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordHasher);

  // Account Use Cases
  const getBankAccountUseCase = new GetBankAccountUseCase(bankAccountRepository);
  const listUserBankAccountsUseCase = new ListUserBankAccountsUseCase(bankAccountRepository);
  const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountRepository);
  const renameBankAccountUseCase = new RenameBankAccountUseCase(bankAccountRepository);
  const deleteBankAccountUseCase = new DeleteBankAccountUseCase(bankAccountRepository);

  // Operation Use Cases
  const listAccountOperationsUseCase = new ListAccountOperationsUseCase(
    transactionRepository,
    bankAccountRepository
  );
  const listRecentOperationsUseCase = new ListRecentOperationsUseCase(
    transactionRepository,
    bankAccountRepository
  );
  const transferUseCase = new TransferUseCase(
    transactionRepository,
    bankAccountRepository
  );
  const getOperationsHistoryUseCase = new GetOperationsHistoryUseCase(
    transactionRepository,
    bankAccountRepository
  );

  // Saving Use Cases
  const listUserSavingsUseCase = new ListUserSavingsUseCase(
    savingAccountRepository,
    bankAccountRepository
  );
  const createSavingAccountUseCase = new CreateSavingAccountUseCase(
    savingAccountRepository,
    bankAccountRepository,
    transactionRepository
  );
  const applyDailyInterestUseCase = new ApplyDailyInterestUseCase(
    savingAccountRepository,
    savingProductRepository,
    transactionRepository
  );
  const getCurrentSavingRateUseCase = new GetCurrentSavingRateUseCase(
    savingProductRepository
  );

}
import { db } from '../drizzle/client';

// Repositories Drizzle
import { UserRepositoryDrizzle } from '../repositories/drizzle/UserRepositoryDrizzle';
import { ClientRepositoryDrizzle } from '../repositories/drizzle/ClientRepositoryDrizzle';
import { DirectorRepositoryDrizzle } from '../repositories/drizzle/DirectorRepositoryDrizzle';
import { AdvisorRepositoryDrizzle } from '../repositories/drizzle/AdvisorRepositoryDrizzle';
import { BankAccountRepositoryDrizzle } from '../repositories/drizzle/BankAccountRepositoryDrizzle';
import { OperationRepositoryDrizzle } from '../repositories/drizzle/OperationRepositoryDrizzle';
import { SavingRepositoryDrizzle } from '../repositories/drizzle/SavingRepositoryDrizzle';

// Services/Adapters
import { SimplePasswordHasher } from '../adapters/SimplePasswordHasher';
import { ProfileManager } from '../../application/ports/services/ProfileFetcher';

// Use Cases - Auth
import { RegisterUseCase } from '../../application/use-cases/user/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/user/auth/LoginUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/user/auth/GetUserProfileUseCase';

// Use Cases - Account
import { GetBankAccountUseCase } from '../../application/use-cases/client/account/GetBankAccountUseCase';
import { ListUserBankAccountsUseCase } from '../../application/use-cases/client/account/ListUserBankAccountsUseCase';
import { CreateBankAccountUseCase } from '../../application/use-cases/client/account/CreateBankAccountUseCase';
import { RenameBankAccountUseCase } from '../../application/use-cases/client/account/RenamebankAccountUseCase';
import { DeleteBankAccountUseCase } from '../../application/use-cases/client/account/DeleteBankAccountUseCase';

// Use Cases - Operation
import { ListAccountOperationsUseCase } from '../../application/use-cases/client/operation/ListAccountOperationsUseCase';
import { ListRecentOperationsUseCase } from '../../application/use-cases/client/operation/ListRecentOperationsUseCase';
import { TransferUseCase } from '../../application/use-cases/client/operation/TransferUseCase';

// Use Cases - Saving
import { ListUserSavingsUseCase } from '../../application/use-cases/client/saving/ListUserSavingsUseCase';
import { CreateSavingAccountUseCase } from '../../application/use-cases/client/saving/CreateSavingAccountUseCase';
import { ApplyDailyInterestUseCase } from '../../application/use-cases/client/saving/ApplyDailyInterestUseCase';
import { GetCurrentSavingRateUseCase } from '../../application/use-cases/client/saving/GetCurrentSavingRateUseCase';

export function createContainer() {

  const userRepository = new UserRepositoryDrizzle(db);
  const clientRepository = new ClientRepositoryDrizzle(db);
  const directorRepository = new DirectorRepositoryDrizzle(db);
  const advisorRepository = new AdvisorRepositoryDrizzle(db);
  const bankAccountRepository = new BankAccountRepositoryDrizzle(db);
  const operationRepository = new OperationRepositoryDrizzle(db);
  const savingRepository = new SavingRepositoryDrizzle(db);
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

  // Account Use Cases
  const getBankAccountUseCase = new GetBankAccountUseCase(bankAccountRepository);
  const listUserBankAccountsUseCase = new ListUserBankAccountsUseCase(bankAccountRepository);
  const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountRepository);
  const renameBankAccountUseCase = new RenameBankAccountUseCase(bankAccountRepository);
  const deleteBankAccountUseCase = new DeleteBankAccountUseCase(bankAccountRepository);

  // Operation Use Cases
  const listAccountOperationsUseCase = new ListAccountOperationsUseCase(
    operationRepository,
    bankAccountRepository
  );
  const listRecentOperationsUseCase = new ListRecentOperationsUseCase(
    operationRepository,
    bankAccountRepository
  );
  const transferUseCase = new TransferUseCase(
    operationRepository,
    bankAccountRepository
  );

  // Saving Use Cases
  const listUserSavingsUseCase = new ListUserSavingsUseCase(
    savingRepository,
    bankAccountRepository
  );
  const createSavingAccountUseCase = new CreateSavingAccountUseCase(
    savingRepository,
    bankAccountRepository,
    operationRepository
  );
  const applyDailyInterestUseCase = new ApplyDailyInterestUseCase(
    savingRepository,
    operationRepository
  );
  const getCurrentSavingRateUseCase = new GetCurrentSavingRateUseCase();
  
  return {
    repositories: {
      user: userRepository,
      client: clientRepository,
      director: directorRepository,
      advisor: advisorRepository,
      bankAccount: bankAccountRepository,
      operation: operationRepository,
      saving: savingRepository,
    },

    services: {
      passwordHasher,
      profileManager,
    },

    useCases: {
      auth: {
        register: registerUseCase,
        login: loginUseCase,
        getUserProfile: getUserProfileUseCase,
      },
      account: {
        get: getBankAccountUseCase,
        list: listUserBankAccountsUseCase,
        create: createBankAccountUseCase,
        rename: renameBankAccountUseCase,
        delete: deleteBankAccountUseCase,
      },
      operation: {
        listForAccount: listAccountOperationsUseCase,
        listRecent: listRecentOperationsUseCase,
        transfer: transferUseCase,
      },
      saving: {
        listUser: listUserSavingsUseCase,
        create: createSavingAccountUseCase,
        applyDailyInterest: applyDailyInterestUseCase,
        getCurrentRate: getCurrentSavingRateUseCase,
      },
    },
  };
}

export type Container = ReturnType<typeof createContainer>;

import { db } from '../drizzle/client';

// Repositories Drizzle
import { UserRepositoryDrizzle } from '../repositories/drizzle/UserRepositoryDrizzle';
import { ClientRepositoryDrizzle } from '../repositories/drizzle/ClientRepositoryDrizzle';
import { DirectorRepositoryDrizzle } from '../repositories/drizzle/DirectorRepositoryDrizzle';
import { AdvisorRepositoryDrizzle } from '../repositories/drizzle/AdvisorRepositoryDrizzle';
import { BankAccountRepositoryDrizzle } from '../repositories/drizzle/BankAccountRepositoryDrizzle';
import { TransactionRepositoryDrizzle } from '../repositories/drizzle/TransactionRepositoryDrizzle';
import { SavingRepositoryDrizzle } from '../repositories/drizzle/SavingRepositoryDrizzle';
import { SavingProductRepositoryDrizzle } from '../repositories/drizzle/SavingProductRepositoryDrizzle';
import { LoanRepositoryDrizzle } from '../repositories/drizzle/LoanRepositoryDrizzle';
import { CompanyRepositoryDrizzle } from '../repositories/drizzle/CompanyRepositoryDrizzle';
import { OrderRepositoryDrizzle } from '../repositories/drizzle/OrderRepositoryDrizzle';
import { StockRepositoryDrizzle } from '../repositories/drizzle/StockRepositoryDrizzle';
import { PortfolioRepositoryDrizzle } from '../repositories/drizzle/PortfolioRepositoryDrizzle';
import { HoldingRepositoryDrizzle } from '../repositories/drizzle/HoldingRepositoryDrizzle';
import { TradeRepositoryDrizzle } from '../repositories/drizzle/TradeRepositoryDrizzle';
import { DiscussionRepositoryDrizzle } from '../repositories/drizzle/DiscussionRepositoryDrizzle';


// Mappers Drizzle

import { DrizzleUserMapper } from '../repositories/mappers/DrizzleMappers/DrizzleUserMapper';
import { DrizzleClientMapper } from '../repositories/mappers/DrizzleMappers/DrizzleClientMapper';
import { DrizzleDirectorMapper } from '../repositories/mappers/DrizzleMappers/DrizzleDirectorMapper';
import { DrizzleAdvisorMapper } from '../repositories/mappers/DrizzleMappers/DrizzleAdvisorMapper';
import { DrizzleBankAccountMapper } from '../repositories/mappers/DrizzleMappers/DrizzleBankAccountMapper';
import { DrizzleTransactionMapper } from '../repositories/mappers/DrizzleMappers/DrizzleTransactionMapper';
import { DrizzleSavingAccountMapper } from '../repositories/mappers/DrizzleMappers/DrizzleSavingAccountMapper';
import { DrizzleSavingProductMapper } from '../repositories/mappers/DrizzleMappers/DrizzleSavingProductMapper';
import { DrizzleLoanMapper } from '../repositories/mappers/DrizzleMappers/DrizzleLoanMapper';
import { DrizzleCompanyMapper } from '../repositories/mappers/DrizzleMappers/DrizzleCompanyMapper';
import { DrizzleOrderMapper } from '../repositories/mappers/DrizzleMappers/DrizzleOrderMapper';
import { DrizzleStockMapper } from '../repositories/mappers/DrizzleMappers/DrizzleStockMapper';
import { DrizzlePortfolioMapper } from '../repositories/mappers/DrizzleMappers/DrizzlePortfolioMapper';
import { DrizzleHoldingMapper } from '../repositories/mappers/DrizzleMappers/DrizzleHoldingMapper';
import { DrizzleTradeMapper } from '../repositories/mappers/DrizzleMappers/DrizzleTradeMapper';
import { DrizzleDiscussionMapper } from '../repositories/mappers/DrizzleMappers/DrizzleDiscussionMapper';


// Services/Adapters
import { SimplePasswordHasher } from '../adapters/SimplePasswordHasher';
import { ProfileManager } from '../../application/ports/services/ProfileFetcher';
import { OrderMatchingService } from '../../application/ports/services/OrderMatchingService';

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

// Use Cases - Transaction
import { ListAccountTransactionsUseCase } from '../../application/use-cases/client/transaction/ListAccountTransactionsUseCase';
import { ListRecentTransactionsUseCase } from '../../application/use-cases/client/transaction/ListRecentTransactionsUseCase';
import { TransferUseCase } from '../../application/use-cases/client/transaction/TransferUseCase';
import { GetTransactionsHistoryUseCase } from '../../application/use-cases/client/transaction/GetTransactionsHistoryUseCase';
import { CreateCreditUseCase } from '../../application/use-cases/client/transaction/CreateCreditUseCase';
import { CreateDebitUseCase } from '../../application/use-cases/client/transaction/CreateDebitUseCase';

// Use Cases - Saving
import { ApplySavingDailyInterestUseCase } from '../../application/use-cases/client/saving/ApplySavingDailyInterestUseCase';
import { ListUserSavingsUseCase } from '../../application/use-cases/client/saving/ListUserSavingsUseCase';
import { CreateSavingAccountUseCase } from '../../application/use-cases/client/saving/CreateSavingAccountUseCase';
import { CreateSavingProductUseCase } from '../../application/use-cases/director/saving/CreateSavingProductUseCase';
import { UpdateSavingProductUseCase } from '../../application/use-cases/director/saving/UpdateSavingProductUseCase';
import { ListSavingProductsUseCase } from '../../application/use-cases/director/saving/ListSavingProductsUseCase';

// use Cases - Loan
import { RequestLoanUseCase } from '../../application/use-cases/client/loan/RequestLoanUseCase';
import { SimulateLoanUseCase } from '../../application/use-cases/client/loan/SimulateLoanUseCase';
import { GrantLoanUseCase } from '../../application/use-cases/advisor/loan/GrantLoanUseCase';
import { ProcessScheduledLoanPaymentsUseCase } from '../../application/use-cases/advisor/loan/ProcessScheduledLoanPaymentsUseCase';

// Use Cases - Investment
import { PlaceOrderUseCase } from '../../application/use-cases/client/investment/Order/PlaceOrderUseCase';
import { SettleTradesUseCase } from '../../application/use-cases/client/investment/Order/SettleTradesUseCase';
import { CreatePortfolioUseCase } from '../../application/use-cases/client/investment/portfolio/CreatePortfolioUseCase';
import { AddCompanyUseCase } from '../../application/use-cases/director/company/AddCompanyUseCase';
import { CreateStockUseCase } from '../../application/use-cases/director/stock/CreateStockUseCase';
import { ListCompaniesUseCase } from '../../application/use-cases/client/investment/ListCompaniesUseCase';
import { list } from 'pdfkit';
import { ListStocksUseCase } from '../../application/use-cases/client/investment/ListStocksUseCase';


export function createContainer() {

  const drizzleUserMapper = new DrizzleUserMapper();
  const drizzleClientMapper = new DrizzleClientMapper();
  const drizzleDirectorMapper = new DrizzleDirectorMapper();
  const drizzleAdvisorMapper = new DrizzleAdvisorMapper();
  const drizzleBankAccountMapper = new DrizzleBankAccountMapper();
  const drizzleTransactionMapper = new DrizzleTransactionMapper();
  const drizzleSavingMapper = new DrizzleSavingAccountMapper();
  const drizzleSavingProductMapper = new DrizzleSavingProductMapper();
  const drizzleLoanMapper = new DrizzleLoanMapper();
  const drizzleCompanyMapper = new DrizzleCompanyMapper();
  const drizzleOrderMapper = new DrizzleOrderMapper();
  const drizzleStockMapper = new DrizzleStockMapper();
  const drizzlePortfolioMapper = new DrizzlePortfolioMapper();
  const drizzleHoldingMapper = new DrizzleHoldingMapper();
  const drizzleTradeMapper = new DrizzleTradeMapper();
  const drizzleDiscussionMapper = new DrizzleDiscussionMapper();
  

  const userRepository = new UserRepositoryDrizzle(db, drizzleUserMapper);
  const clientRepository = new ClientRepositoryDrizzle(db, drizzleClientMapper);
  const directorRepository = new DirectorRepositoryDrizzle(db, drizzleDirectorMapper);
  const advisorRepository = new AdvisorRepositoryDrizzle(db, drizzleAdvisorMapper);
  const bankAccountRepository = new BankAccountRepositoryDrizzle(db, drizzleBankAccountMapper);
  const transactionRepository = new TransactionRepositoryDrizzle(db, drizzleTransactionMapper);
  const savingRepository = new SavingRepositoryDrizzle(db, drizzleSavingMapper);
  const savingProductRepository = new SavingProductRepositoryDrizzle(db, drizzleSavingProductMapper);
  const loanRepository = new LoanRepositoryDrizzle(db, drizzleLoanMapper);
  const companyRepository = new CompanyRepositoryDrizzle(db, drizzleCompanyMapper);
  const orderRepository = new OrderRepositoryDrizzle(db, drizzleOrderMapper);
  const stockRepository = new StockRepositoryDrizzle(db, drizzleStockMapper);
  const portfolioRepository = new PortfolioRepositoryDrizzle(db, drizzlePortfolioMapper);
  const holdingRepository = new HoldingRepositoryDrizzle(db, drizzleHoldingMapper);
  const tradeRepository = new TradeRepositoryDrizzle(db, drizzleTradeMapper);
  const discussionRepository = new DiscussionRepositoryDrizzle(db, drizzleDiscussionMapper);
  
  const passwordHasher = new SimplePasswordHasher();

  const profileManager = new ProfileManager(
    clientRepository,
    directorRepository,
    advisorRepository
  );

  const orderMatchingService = new OrderMatchingService(orderRepository, stockRepository, portfolioRepository)
  
  const registerUseCase = new RegisterUseCase(
    userRepository,
    advisorRepository,
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
  const getBankAccountUseCase = new GetBankAccountUseCase(bankAccountRepository, clientRepository);
  const listUserBankAccountsUseCase = new ListUserBankAccountsUseCase(bankAccountRepository, clientRepository);
  const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountRepository, clientRepository);
  const renameBankAccountUseCase = new RenameBankAccountUseCase(bankAccountRepository);
  const deleteBankAccountUseCase = new DeleteBankAccountUseCase(bankAccountRepository, clientRepository);

  // Transaction Use Cases
  const listAccountTransactionsUseCase = new ListAccountTransactionsUseCase(
    clientRepository,
    transactionRepository,
    bankAccountRepository
  );
  const listRecentTransactionsUseCase = new ListRecentTransactionsUseCase(
    transactionRepository,
    bankAccountRepository
  );
  const transferUseCase = new TransferUseCase(
    clientRepository,
    transactionRepository,
    bankAccountRepository
  );
  const getTransactionsHistoryUseCase = new GetTransactionsHistoryUseCase(
    clientRepository,
    transactionRepository,
    bankAccountRepository
  );

  const createCreditUseCase = new CreateCreditUseCase(transactionRepository)
  const createDebitUseCase = new CreateDebitUseCase(transactionRepository)


  // Saving Use Cases
  const listUserSavingsUseCase = new ListUserSavingsUseCase(
    savingRepository,
    clientRepository
  );
  const createSavingAccountUseCase = new CreateSavingAccountUseCase(
    clientRepository,
    savingRepository,
    savingProductRepository,
    bankAccountRepository,
    transactionRepository
  );

  const listSavingProductsUseCase = new ListSavingProductsUseCase(savingProductRepository);
  const applySavingDailyInterestUseCase = new ApplySavingDailyInterestUseCase(
    savingProductRepository,
    savingRepository,
    transactionRepository
  );
  const createSavingProductUseCase = new CreateSavingProductUseCase(savingProductRepository);
  const updateSavingProductUseCase = new UpdateSavingProductUseCase(savingProductRepository);

  //loan Use Cases
  const requestLoanUseCase = new RequestLoanUseCase(loanRepository, clientRepository);
  const grantLoanUseCase = new GrantLoanUseCase(loanRepository, clientRepository, advisorRepository);
  const simulateLoanUseCase = new SimulateLoanUseCase();
  const processScheduledLoanPaymentsUseCase = new ProcessScheduledLoanPaymentsUseCase(loanRepository, bankAccountRepository, transactionRepository)

  //Investment Use Cases
  const placeOrderUseCase = new PlaceOrderUseCase(orderRepository, stockRepository, clientRepository, orderMatchingService);
  const settleTradeUseCase = new SettleTradesUseCase(tradeRepository, portfolioRepository, bankAccountRepository, transactionRepository);
  const createPortfolioUseCase = new CreatePortfolioUseCase(clientRepository, portfolioRepository)
  const addCompanyUseCase = new AddCompanyUseCase(companyRepository);
  const createStockUseCase  = new CreateStockUseCase(stockRepository, companyRepository);
  const listCompaniesUseCase = new ListCompaniesUseCase(companyRepository);
  const listStockUseCase = new ListStocksUseCase(stockRepository);

  
  return {
    repositories: {
      user: userRepository,
      client: clientRepository,
      director: directorRepository,
      advisor: advisorRepository,
      bankAccount: bankAccountRepository,
      transaction: transactionRepository,
      saving: savingRepository,
      savingProduct: savingProductRepository,
      loan: loanRepository,
      order: orderRepository,
      stock: stockRepository,
      portfolio: portfolioRepository,
      holding: holdingRepository,
      trade: tradeRepository,
      discussion: discussionRepository,
      company: companyRepository
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
        refreshToken: refreshTokenUseCase,
        resetPassword: resetPasswordUseCase,
      },
      bankAccount: {
        get: getBankAccountUseCase,
        list: listUserBankAccountsUseCase,
        create: createBankAccountUseCase,
        rename: renameBankAccountUseCase,
        delete: deleteBankAccountUseCase,
      },
      transaction: {
        listForAccount: listAccountTransactionsUseCase,
        listRecent: listRecentTransactionsUseCase,
        transfer: transferUseCase,
        getHistory: getTransactionsHistoryUseCase,
        createCredit: createCreditUseCase,
        createDebit: createDebitUseCase
      },
      saving: {
        listUser: listUserSavingsUseCase,
        create: createSavingAccountUseCase,
        applySavingDailyInterest: applySavingDailyInterestUseCase,
        createSavingProduct: createSavingProductUseCase,
        updateSavingProduct: updateSavingProductUseCase,
        listSavingProducts: listSavingProductsUseCase
      },
      loan: {
        requestLoan: requestLoanUseCase,
        grantLoan: grantLoanUseCase,
        simulateLoan: simulateLoanUseCase,
        processLoanPayments: processScheduledLoanPaymentsUseCase
      },
      investment: {
        addCompany: addCompanyUseCase,
        createStock: createStockUseCase,
        placeOrder: placeOrderUseCase,
        createPortfolio: createPortfolioUseCase,
        settleTrade: settleTradeUseCase,
        listCompanies: listCompaniesUseCase,
        listStocks: listStockUseCase
      }
    },
  };
}

export type Container = ReturnType<typeof createContainer>;

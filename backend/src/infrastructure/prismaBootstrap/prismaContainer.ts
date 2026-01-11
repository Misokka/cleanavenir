import { PrismaClient } from "@prisma/client";

// Repositories Prisma
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { PrismaClientRepository } from '../repositories/prisma/PrismaClientRepository';
import { PrismaDirectorRepository } from '../repositories/prisma/PrismaDirectorRepository';
import { PrismaAdvisorRepository } from '../repositories/prisma/PrismaAdvisorRepository';
import { PrismaBankAccountRepository } from '../repositories/prisma/PrismaBankAccountRepository';
import { PrismaTransactionRepository } from '../repositories/prisma/PrismaTransactionRepository';
import { PrismaSavingAccountRepository } from '../repositories/prisma/PrismaSavingAccountRepository';
import { PrismaSavingProductRepository } from '../repositories/prisma/PrismaSavingProductRepository';
import { PrismaLoanRepository } from '../repositories/prisma/PrismaLoanRepository';
import { PrismaCompanyRepository } from '../repositories/prisma/PrismaCompanyRepository';
import { PrismaOrderRepository } from '../repositories/prisma/PrismaOrderRepository';
import { PrismaStockRepository } from '../repositories/prisma/PrismaStockRepository';
import { PrismaPortfolioRepository } from '../repositories/prisma/PrismaPortfolioRepository';
import { PrismaHoldingRepository } from '../repositories/prisma/PrismaHoldingRepository';
import { PrismaTradeRepository } from '../repositories/prisma/PrismaTradeRepository';
import { PrismaDiscussionRepository } from '../repositories/prisma/PrismaDiscussionRepository';
import { PrismaMessageRepository } from '../repositories/prisma/PrismaMessageRepository';
import { PrismaDiscussionTransferRepository } from '../repositories/prisma/PrismaDiscussionTransferRepository';
import { PrismaStockPriceHistoryRepository } from "../repositories/prisma/PrismaStockPriceHistoryRepository";
import { PrismaBeneficiaryRepository } from '../repositories/prisma/PrismaBeneficiaryRepository';
import { PrismaEmailVerificationTokenRepository } from '../repositories/prisma/PrismaEmailVerificationTokenRepository';


// Mappers Prisma
import { PrismaUserMapper } from '../repositories/mappers/PrismaMappers/PrismaUserMapper';
import { PrismaClientMapper } from '../repositories/mappers/PrismaMappers/PrismaClientMapper';
import { PrismaDirectorMapper } from '../repositories/mappers/PrismaMappers/PrismaDirectorMapper';
import { PrismaAdvisorMapper } from '../repositories/mappers/PrismaMappers/PrismaAdvisorMapper';
import { PrismaBankAccountMapper } from '../repositories/mappers/PrismaMappers/PrismaBankAccountMapper';
import { PrismaTransactionMapper } from '../repositories/mappers/PrismaMappers/PrismaTransactionMapper';
import { PrismaSavingAccountMapper } from '../repositories/mappers/PrismaMappers/PrismaSavingAccountMapper';
import { PrismaSavingProductMapper } from '../repositories/mappers/PrismaMappers/PrismaSavingProductMapper';
import { PrismaLoanMapper } from '../repositories/mappers/PrismaMappers/PrismaLoanMapper';
import { PrismaCompanyMapper } from '../repositories/mappers/PrismaMappers/PrismaCompanyMapper';
import { PrismaOrderMapper } from '../repositories/mappers/PrismaMappers/PrismaOrderMapper';
import { PrismaStockMapper } from '../repositories/mappers/PrismaMappers/PrismaStockMapper';
import { PrismaPortfolioMapper } from '../repositories/mappers/PrismaMappers/PrismaPortfolioMapper';
import { PrismaHoldingMapper } from '../repositories/mappers/PrismaMappers/PrismaHoldingMapper';
import { PrismaTradeMapper } from '../repositories/mappers/PrismaMappers/PrismaTradeMapper';
import { PrismaDiscussionMapper } from '../repositories/mappers/PrismaMappers/PrismaDiscussionMapper';
import { PrismaMessageMapper } from '../repositories/mappers/PrismaMappers/PrismaMessageMapper';
import { PrismaDiscussionTransferMapper } from '../repositories/mappers/PrismaMappers/PrismaDiscussionTransferMapper';
import { PrismaStockPriceHistoryMapper } from '../repositories/mappers/PrismaMappers/PrismaStockPriceHistoryMapper';
import { PrismaBeneficiaryMapper } from '../repositories/mappers/PrismaMappers/PrismaBeneficiaryMapper';


// Services/Adapters
import { SimplePasswordHasher } from '../adapters/SimplePasswordHasher';
import { NodemailerEmailService } from '../adapters/NodemailerEmailService';
import { ProfileManager } from '../../application/ports/services/ProfileFetcher';
import { OrderMatchingService } from '../../application/ports/services/OrderMatchingService';

// Use Cases - Auth
import { RegisterUseCase } from '../../application/use-cases/user/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/user/auth/LoginUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/user/auth/GetUserProfileUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/user/auth/RefreshTokenUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/user/auth/ResetPasswordUseCase';
import { VerifyEmailUseCase } from '../../application/use-cases/user/email-verification/VerifyEmailUseCase';
import { ResendVerificationEmailUseCase } from '../../application/use-cases/user/email-verification/ResendVerificationEmailUseCase';

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
import { TransferFromSavingUseCase } from '../../application/use-cases/client/saving/TransferFromSavingUseCase';
import { DepositToSavingUseCase } from '../../application/use-cases/client/saving/DepositToSavingUseCase';
import { CreateSavingProductUseCase } from '../../application/use-cases/director/saving/CreateSavingProductUseCase';
import { UpdateSavingProductUseCase } from '../../application/use-cases/director/saving/UpdateSavingProductUseCase';
import { ListSavingProductsUseCase } from '../../application/use-cases/director/saving/ListSavingProductsUseCase';

// use Cases - Loan
import { RequestLoanUseCase } from '../../application/use-cases/client/loan/RequestLoanUseCase';
import { SimulateLoanUseCase } from '../../application/use-cases/client/loan/SimulateLoanUseCase';
import { GrantLoanUseCase } from '../../application/use-cases/advisor/loan/GrantLoanUseCase';
import { ProcessScheduledLoanPaymentsUseCase } from '../../application/use-cases/advisor/loan/ProcessScheduledLoanPaymentsUseCase';
import { ListPendingLoansUseCase } from '../../application/use-cases/advisor/loan/ListPendingLoansUseCase';
import { ApproveLoanUseCase } from '../../application/use-cases/advisor/loan/ApproveLoanUseCase';
import { RejectLoanUseCase } from '../../application/use-cases/advisor/loan/RejectLoanUseCase';
import { ListAdvisorClientsUseCase } from '../../application/use-cases/advisor/loan/ListAdvisorClientsUseCase';

// Use Cases - Investment
import { PlaceOrderUseCase } from '../../application/use-cases/client/investment/Order/PlaceOrderUseCase';
import { SettleTradesUseCase } from '../../application/use-cases/client/investment/Order/SettleTradesUseCase';
import { CreatePortfolioUseCase } from '../../application/use-cases/client/investment/portfolio/CreatePortfolioUseCase';
import { AddCompanyUseCase } from '../../application/use-cases/director/company/AddCompanyUseCase';
import { GetCompanyByIdUseCase } from '../../application/use-cases/director/company/GetCompanyByIdUseCase';
import { UpdateCompanyUseCase } from '../../application/use-cases/director/company/UpdateCompanyUseCase';
import { DeleteCompanyUseCase } from '../../application/use-cases/director/company/DeleteCompanyUseCase';
import { CreateStockUseCase } from '../../application/use-cases/director/stock/CreateStockUseCase';
import { ListCompaniesUseCase } from '../../application/use-cases/client/investment/ListCompaniesUseCase';
import { ListStocksUseCase } from '../../application/use-cases/client/investment/stock/ListStocksUseCase';
import { ListMyOrdersUseCase } from '../../application/use-cases/client/investment/Order/ListMyOrdersUseCase';
import { GetMyPortfolioUseCase } from '../../application/use-cases/client/investment/portfolio/GetMyPortfolioUseCase';
import { ShowBestBuyAndSellOrderForStockUseCase } from '../../application/use-cases/client/investment/Order/ShowBestBuyAndSellOrderForStock';
import { GetStockPriceHistoryUseCase } from '../../application/use-cases/client/investment/stock/GetStockPriceHistoryUseCase';
import { EditStockUseCase } from '../../application/use-cases/director/stock/EditStockUseCase';
import { GetStockUseCase } from '../../application/use-cases/client/investment/stock/GetStockUseCase';

// Use Cases - Director Account Management (Bank Accounts)
import { CreateBankAccountForClientUseCase } from '../../application/use-cases/director/account/CreateBankAccountForClientUseCase';
import { RenameBankAccountByDirectorUseCase } from '../../application/use-cases/director/account/RenameBankAccountByDirectorUseCase';
import { DeleteBankAccountByDirectorUseCase } from '../../application/use-cases/director/account/DeleteBankAccountByDirectorUseCase';

// Use Cases - Director Client Management (Users)
import { CreateClientByDirectorUseCase } from '../../application/use-cases/director/client/CreateClientByDirectorUseCase';
import { UpdateClientByDirectorUseCase } from '../../application/use-cases/director/client/UpdateClientByDirectorUseCase';
import { DeleteClientByDirectorUseCase } from '../../application/use-cases/director/client/DeleteClientByDirectorUseCase';

// Use Cases - Beneficiary
import { AddBeneficiaryUseCase } from '../../application/use-cases/client/beneficiary/AddBeneficiaryUseCase';
import { ListUserBeneficiariesUseCase } from '../../application/use-cases/client/beneficiary/ListUserBeneficiariesUseCase';
import { DeleteBeneficiaryUseCase } from '../../application/use-cases/client/beneficiary/DeleteBeneficiaryUseCase';
import { UpdateBeneficiaryLabelUseCase } from '../../application/use-cases/client/beneficiary/UpdateBeneficiaryLabelUseCase';
import { CancelOrderUseCase } from '../../application/use-cases/client/investment/Order/CancelOrderUseCase';

// Use Cases - Messaging (Client)
import { CreateDiscussionUseCase } from '../../application/use-cases/client/messaging/CreateDiscussionUseCase';
import { ListClientDiscussionsUseCase } from '../../application/use-cases/client/messaging/ListClientDiscussionsUseCase';
import { SendClientMessageUseCase } from '../../application/use-cases/client/messaging/SendClientMessageUseCase';
import { GetClientDiscussionUseCase } from '../../application/use-cases/client/messaging/GetClientDiscussionUseCase';

// Use Cases - Messaging (Advisor)
import { ListAdvisorDiscussionsUseCase } from '../../application/use-cases/advisor/messaging/ListAdvisorDiscussionsUseCase';
import { SendAdvisorMessageUseCase } from '../../application/use-cases/advisor/messaging/SendAdvisorMessageUseCase';
import { GetAdvisorDiscussionUseCase } from '../../application/use-cases/advisor/messaging/GetAdvisorDiscussionUseCase';
import { TransferDiscussionUseCase } from '../../application/use-cases/advisor/messaging/TransferDiscussionUseCase';
import { ListAdvisorsUseCase } from '../../application/use-cases/advisor/messaging/ListAdvisorsUseCase';
import { PrismaEmailVerificationTokenMapper } from "../repositories/mappers/PrismaMappers/PrismaEmailVerificationTokenMapper";


export function createContainer() {

  const prismaClient = new PrismaClient();

  const prismaUserMapper = new PrismaUserMapper();
  const prismaClientMapper = new PrismaClientMapper();
  const prismaDirectorMapper = new PrismaDirectorMapper();
  const prismaAdvisorMapper = new PrismaAdvisorMapper();
  const prismaBankAccountMapper = new PrismaBankAccountMapper();
  const prismaTransactionMapper = new PrismaTransactionMapper();
  const prismaSavingMapper = new PrismaSavingAccountMapper();
  const prismaSavingProductMapper = new PrismaSavingProductMapper();
  const prismaLoanMapper = new PrismaLoanMapper();
  const prismaCompanyMapper = new PrismaCompanyMapper();
  const prismaOrderMapper = new PrismaOrderMapper();
  const prismaStockMapper = new PrismaStockMapper();
  const prismaPortfolioMapper = new PrismaPortfolioMapper();
  const prismaHoldingMapper = new PrismaHoldingMapper();
  const prismaTradeMapper = new PrismaTradeMapper();
  const prismaDiscussionMapper = new PrismaDiscussionMapper();
  const prismaMessageMapper = new PrismaMessageMapper();
  const prismaDiscussionTransferMapper = new PrismaDiscussionTransferMapper();
  const prismaStockPriceHistoryMapper = new PrismaStockPriceHistoryMapper();
  const prismaBeneficiaryMapper = new PrismaBeneficiaryMapper();
  const prismaEmailVerificationTokenMapper = new PrismaEmailVerificationTokenMapper()

  const prismaUserRepository = new PrismaUserRepository(prismaClient, prismaUserMapper);
  const prismaClientRepository = new PrismaClientRepository(prismaClient, prismaClientMapper);
  const prismaDirectorRepository = new PrismaDirectorRepository(prismaClient, prismaDirectorMapper);
  const prismaAdvisorRepository = new PrismaAdvisorRepository(prismaClient, prismaAdvisorMapper);
  const prismaBankAccountRepository = new PrismaBankAccountRepository(prismaClient, prismaBankAccountMapper);
  const prismaTransactionRepository = new PrismaTransactionRepository(prismaClient, prismaTransactionMapper);
  const prismaSavingRepository = new PrismaSavingAccountRepository(prismaClient, prismaSavingMapper);
  const prismaSavingProductRepository = new PrismaSavingProductRepository(prismaClient, prismaSavingProductMapper);
  const prismaLoanRepository = new PrismaLoanRepository(prismaClient, prismaLoanMapper);
  const prismaCompanyRepository = new PrismaCompanyRepository(prismaClient, prismaCompanyMapper);
  const prismaOrderRepository = new PrismaOrderRepository(prismaClient, prismaOrderMapper);
  const prismaStockRepository = new PrismaStockRepository(prismaClient, prismaStockMapper);
  const prismaPortfolioRepository = new PrismaPortfolioRepository(prismaClient, prismaPortfolioMapper, prismaHoldingMapper);
  const prismaHoldingRepository = new PrismaHoldingRepository(prismaClient, prismaHoldingMapper);
  const prismaTradeRepository = new PrismaTradeRepository(prismaClient, prismaTradeMapper);
  const prismaDiscussionRepository = new PrismaDiscussionRepository(prismaClient, prismaDiscussionMapper);
  const prismaMessageRepository = new PrismaMessageRepository(prismaClient, prismaMessageMapper);
  const prismaDiscussionTransferRepository = new PrismaDiscussionTransferRepository(prismaClient, prismaDiscussionTransferMapper);
  const prismaStockPriceHistoryRepository = new PrismaStockPriceHistoryRepository(prismaClient, prismaStockPriceHistoryMapper);
  const prismaBeneficiaryRepository = new PrismaBeneficiaryRepository(prismaClient, prismaBeneficiaryMapper);
  const prismaEmailVerificationTokenRepository = new PrismaEmailVerificationTokenRepository(prismaClient, prismaEmailVerificationTokenMapper);

  const passwordHasher = new SimplePasswordHasher();
  const emailService = new NodemailerEmailService();

  const profileManager = new ProfileManager(
    prismaClientRepository,
    prismaDirectorRepository,
    prismaAdvisorRepository
  );

  const orderMatchingService = new OrderMatchingService(
    prismaOrderRepository, 
    prismaStockRepository, 
    prismaStockPriceHistoryRepository, 
    prismaPortfolioRepository, 
    prismaTradeRepository, 
    prismaBankAccountRepository, 
    prismaTransactionRepository
  );

  const registerUseCase = new RegisterUseCase(
    prismaUserRepository,
    prismaAdvisorRepository,
    profileManager,
    passwordHasher,
    prismaEmailVerificationTokenRepository,
    emailService
  );

  // Email Verification Use Cases
  const verifyEmailUseCase = new VerifyEmailUseCase(prismaEmailVerificationTokenRepository, prismaUserRepository);
  const resendVerificationEmailUseCase = new ResendVerificationEmailUseCase(prismaUserRepository, prismaEmailVerificationTokenRepository, emailService);

  const loginUseCase = new LoginUseCase(
    prismaUserRepository,
    passwordHasher,
    profileManager
  );

  const getUserProfileUseCase = new GetUserProfileUseCase(prismaUserRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(prismaUserRepository, profileManager);
  const resetPasswordUseCase = new ResetPasswordUseCase(prismaUserRepository, passwordHasher);

  // Account Use Cases
  const getBankAccountUseCase = new GetBankAccountUseCase(prismaBankAccountRepository, prismaClientRepository);
  const listUserBankAccountsUseCase = new ListUserBankAccountsUseCase(prismaBankAccountRepository, prismaClientRepository);
  const createBankAccountUseCase = new CreateBankAccountUseCase(prismaBankAccountRepository, prismaClientRepository);
  const renameBankAccountUseCase = new RenameBankAccountUseCase(prismaBankAccountRepository, prismaClientRepository);
  const deleteBankAccountUseCase = new DeleteBankAccountUseCase(prismaBankAccountRepository, prismaClientRepository);

  // Transaction Use Cases
  const listAccountTransactionsUseCase = new ListAccountTransactionsUseCase(
    prismaClientRepository,
    prismaTransactionRepository,
    prismaBankAccountRepository
  );
  const listRecentTransactionsUseCase = new ListRecentTransactionsUseCase(
    prismaTransactionRepository,
    prismaBankAccountRepository
  );
  const transferUseCase = new TransferUseCase(
    prismaClientRepository,
    prismaTransactionRepository,
    prismaBankAccountRepository
  );
  const getTransactionsHistoryUseCase = new GetTransactionsHistoryUseCase(
    prismaClientRepository,
    prismaTransactionRepository,
    prismaBankAccountRepository
  );

  const createCreditUseCase = new CreateCreditUseCase(prismaTransactionRepository)
  const createDebitUseCase = new CreateDebitUseCase(prismaTransactionRepository)


  // Saving Use Cases
  const listUserSavingsUseCase = new ListUserSavingsUseCase(
    prismaSavingRepository,
    prismaClientRepository
  );
  const createSavingAccountUseCase = new CreateSavingAccountUseCase(
    prismaClientRepository,
    prismaSavingRepository,
    prismaSavingProductRepository,
    prismaBankAccountRepository,
    prismaTransactionRepository
  );

  const transferFromSavingUseCase = new TransferFromSavingUseCase(
    prismaClientRepository,
    prismaSavingRepository,
    prismaBankAccountRepository,
    prismaTransactionRepository
  );

  const depositToSavingUseCase = new DepositToSavingUseCase(
    prismaClientRepository,
    prismaSavingRepository,
    prismaBankAccountRepository,
    prismaTransactionRepository
  );

  const listSavingProductsUseCase = new ListSavingProductsUseCase(prismaSavingProductRepository);
  const applySavingDailyInterestUseCase = new ApplySavingDailyInterestUseCase(
    prismaSavingProductRepository,
    prismaSavingRepository,
    prismaTransactionRepository
  );
  const createSavingProductUseCase = new CreateSavingProductUseCase(prismaSavingProductRepository);
  const updateSavingProductUseCase = new UpdateSavingProductUseCase(prismaSavingProductRepository);

  //loan Use Cases
  const requestLoanUseCase = new RequestLoanUseCase(prismaLoanRepository, prismaClientRepository);
  const grantLoanUseCase = new GrantLoanUseCase(prismaLoanRepository, prismaClientRepository, prismaAdvisorRepository);
  const simulateLoanUseCase = new SimulateLoanUseCase();
  const processScheduledLoanPaymentsUseCase = new ProcessScheduledLoanPaymentsUseCase(prismaLoanRepository, prismaBankAccountRepository, prismaTransactionRepository);
  const listPendingLoansUseCase = new ListPendingLoansUseCase(prismaLoanRepository, prismaAdvisorRepository, prismaClientRepository);
  const approveLoanUseCase = new ApproveLoanUseCase(prismaLoanRepository, prismaBankAccountRepository, prismaTransactionRepository, prismaClientRepository);
  const rejectLoanUseCase = new RejectLoanUseCase(prismaLoanRepository);
  const listAdvisorClientsUseCase = new ListAdvisorClientsUseCase(prismaLoanRepository);

  //Investment Use Cases
  const placeOrderUseCase = new PlaceOrderUseCase(prismaOrderRepository, prismaStockRepository, prismaClientRepository, prismaBankAccountRepository, prismaPortfolioRepository, prismaTransactionRepository, orderMatchingService);
  const cancelOrderUseCase = new CancelOrderUseCase(prismaClientRepository, prismaOrderRepository, prismaPortfolioRepository, prismaBankAccountRepository, prismaTransactionRepository, prismaStockRepository);
  const settleTradeUseCase = new SettleTradesUseCase(prismaTradeRepository, prismaPortfolioRepository, prismaBankAccountRepository, prismaTransactionRepository);
  const createPortfolioUseCase = new CreatePortfolioUseCase(prismaClientRepository, prismaPortfolioRepository);
  const getMyPortfolioUseCase = new GetMyPortfolioUseCase(prismaClientRepository, prismaPortfolioRepository, prismaStockRepository, prismaCompanyRepository);
  const addCompanyUseCase = new AddCompanyUseCase(prismaCompanyRepository);
  const getCompanyByIdUseCase = new GetCompanyByIdUseCase(prismaCompanyRepository);
  const updateCompanyUseCase = new UpdateCompanyUseCase(prismaCompanyRepository);
  const deleteCompanyUseCase = new DeleteCompanyUseCase(prismaCompanyRepository, prismaStockRepository);
  const createStockUseCase  = new CreateStockUseCase(prismaStockRepository, prismaCompanyRepository, prismaUserRepository, prismaClientRepository, prismaPortfolioRepository, prismaOrderRepository);
  const listCompaniesUseCase = new ListCompaniesUseCase(prismaCompanyRepository);
  const listStockUseCase = new ListStocksUseCase(prismaStockRepository);
  const listMyOrdersUseCase = new ListMyOrdersUseCase(prismaClientRepository, prismaOrderRepository, prismaStockRepository);
  const showBestBuyAndSellOrderUseCase = new ShowBestBuyAndSellOrderForStockUseCase(prismaOrderRepository, prismaStockRepository);
  const getStockPriceHistoryUseCase = new GetStockPriceHistoryUseCase(prismaStockRepository, prismaStockPriceHistoryRepository);
  const editStockUseCase = new EditStockUseCase(prismaStockRepository);
  const getStockUseCase = new GetStockUseCase(prismaStockRepository, prismaCompanyRepository);

  // Director Bank Account Management Use Cases
  const createAccountForClientUseCase = new CreateBankAccountForClientUseCase(prismaBankAccountRepository, prismaClientRepository);
  const renameAccountByDirectorUseCase = new RenameBankAccountByDirectorUseCase(prismaBankAccountRepository);
  const deleteAccountByDirectorUseCase = new DeleteBankAccountByDirectorUseCase(prismaBankAccountRepository);

  // Director Client Management Use Cases
  const createClientByDirectorUseCase = new CreateClientByDirectorUseCase(prismaUserRepository, prismaAdvisorRepository, profileManager, passwordHasher);
  const updateClientByDirectorUseCase = new UpdateClientByDirectorUseCase(prismaUserRepository, passwordHasher);
  const deleteClientByDirectorUseCase = new DeleteClientByDirectorUseCase(
    prismaUserRepository, 
    prismaClientRepository, 
    prismaBankAccountRepository, 
    prismaSavingRepository, 
    prismaLoanRepository, 
    prismaPortfolioRepository, 
    prismaOrderRepository, 
    prismaTransactionRepository
  );

  // Beneficiary Use Cases
  const addBeneficiaryUseCase = new AddBeneficiaryUseCase(prismaBeneficiaryRepository, prismaClientRepository, prismaBankAccountRepository);
  const listUserBeneficiariesUseCase = new ListUserBeneficiariesUseCase(prismaBeneficiaryRepository, prismaClientRepository);
  const deleteBeneficiaryUseCase = new DeleteBeneficiaryUseCase(prismaBeneficiaryRepository, prismaClientRepository);
  const updateBeneficiaryLabelUseCase = new UpdateBeneficiaryLabelUseCase(prismaBeneficiaryRepository, prismaClientRepository);

  // Messaging Use Cases - Client
  const createDiscussionUseCase = new CreateDiscussionUseCase(prismaDiscussionRepository, prismaClientRepository);
  const listClientDiscussionsUseCase = new ListClientDiscussionsUseCase(prismaDiscussionRepository, prismaClientRepository, prismaAdvisorRepository, prismaUserRepository);
  const sendClientMessageUseCase = new SendClientMessageUseCase(prismaDiscussionRepository, prismaMessageRepository, prismaClientRepository);
  const getClientDiscussionUseCase = new GetClientDiscussionUseCase(prismaDiscussionRepository, prismaMessageRepository, prismaClientRepository, prismaAdvisorRepository, prismaUserRepository);

  // Messaging Use Cases - Advisor
  const listAdvisorDiscussionsUseCase = new ListAdvisorDiscussionsUseCase(prismaDiscussionRepository, prismaAdvisorRepository, prismaUserRepository, prismaClientRepository);
  const sendAdvisorMessageUseCase = new SendAdvisorMessageUseCase(prismaDiscussionRepository, prismaMessageRepository, prismaAdvisorRepository);
  const getAdvisorDiscussionUseCase = new GetAdvisorDiscussionUseCase(prismaDiscussionRepository, prismaMessageRepository, prismaAdvisorRepository, prismaUserRepository, prismaClientRepository);
  const transferDiscussionUseCase = new TransferDiscussionUseCase(prismaDiscussionRepository, prismaDiscussionTransferRepository, prismaAdvisorRepository);
  const listAdvisorsUseCase = new ListAdvisorsUseCase(prismaAdvisorRepository, prismaUserRepository);

  
  return {
    repositories: {
      user: prismaUserRepository,
      client: prismaClientRepository,
      director: prismaDirectorRepository,
      advisor: prismaAdvisorRepository,
      bankAccount: prismaBankAccountRepository,
      transaction: prismaTransactionRepository,
      saving: prismaSavingRepository,
      savingProduct: prismaSavingProductRepository,
      loan: prismaLoanRepository,
      order: prismaOrderRepository,
      stock: prismaStockRepository,
      portfolio: prismaPortfolioRepository,
      holding: prismaHoldingRepository,
      trade: prismaTradeRepository,
      discussion: prismaDiscussionRepository,
      message: prismaMessageRepository,
      discussionTransfer: prismaDiscussionTransferRepository,
      company: prismaCompanyRepository,
      stockPriceHistory: prismaStockPriceHistoryRepository,
      beneficiary: prismaBeneficiaryRepository,
      emailVerificationToken: prismaEmailVerificationTokenRepository,
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
        verifyEmail: verifyEmailUseCase,
        resendVerificationEmail: resendVerificationEmailUseCase,
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
        transferFromSaving: transferFromSavingUseCase,
        depositToSaving: depositToSavingUseCase,
        applySavingDailyInterest: applySavingDailyInterestUseCase,
        createSavingProduct: createSavingProductUseCase,
        updateSavingProduct: updateSavingProductUseCase,
        listSavingProducts: listSavingProductsUseCase
      },
      loan: {
        requestLoan: requestLoanUseCase,
        grantLoan: grantLoanUseCase,
        simulateLoan: simulateLoanUseCase,
        processLoanPayments: processScheduledLoanPaymentsUseCase,
        listPendingLoans: listPendingLoansUseCase,
        approveLoan: approveLoanUseCase,
        rejectLoan: rejectLoanUseCase,
        listAdvisorClients: listAdvisorClientsUseCase
      },
      investment: {
        addCompany: addCompanyUseCase,
        getCompanyById: getCompanyByIdUseCase,
        updateCompany: updateCompanyUseCase,
        deleteCompany: deleteCompanyUseCase,
        createStock: createStockUseCase,
        placeOrder: placeOrderUseCase,
        cancelOrder: cancelOrderUseCase,
        createPortfolio: createPortfolioUseCase,
        getMyPortfolio: getMyPortfolioUseCase,
        settleTrade: settleTradeUseCase,
        listCompanies: listCompaniesUseCase,
        listStocks: listStockUseCase,
        listMyOrders: listMyOrdersUseCase,
        showBestBuyAndSellOrder: showBestBuyAndSellOrderUseCase,
        getStockPriceHistory: getStockPriceHistoryUseCase,
        editStock: editStockUseCase,
        getStock: getStockUseCase,
      },
      director: {
        createAccountForClient: createAccountForClientUseCase,
        renameAccountByDirector: renameAccountByDirectorUseCase,
        deleteAccountByDirector: deleteAccountByDirectorUseCase,
        createClient: createClientByDirectorUseCase,
        updateClient: updateClientByDirectorUseCase,
        deleteClient: deleteClientByDirectorUseCase,
      },
      beneficiary: {
        add: addBeneficiaryUseCase,
        list: listUserBeneficiariesUseCase,
        delete: deleteBeneficiaryUseCase,
        update: updateBeneficiaryLabelUseCase,
      },
      messaging: {
        client: {
          create: createDiscussionUseCase,
          list: listClientDiscussionsUseCase,
          send: sendClientMessageUseCase,
          get: getClientDiscussionUseCase,
        },
        advisor: {
          list: listAdvisorDiscussionsUseCase,
          send: sendAdvisorMessageUseCase,
          get: getAdvisorDiscussionUseCase,
          transfer: transferDiscussionUseCase,
          listAdvisors: listAdvisorsUseCase,
        },
      },
    },
  };
}

export type PrismaContainer = ReturnType<typeof createContainer>;
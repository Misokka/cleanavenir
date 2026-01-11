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
import { MessageRepositoryDrizzle } from '../repositories/drizzle/MessageRepositoryDrizzle';
import { DiscussionTransferRepositoryDrizzle } from '../repositories/drizzle/DiscussionTransferRepositoryDrizzle';
import { StockPriceHistoryRepositoryDrizzle } from '../repositories/drizzle/StockPriceHistoryRepositoryDrizzle';
import { BeneficiaryRepositoryDrizzle } from '../repositories/drizzle/BeneficiaryRepositoryDrizzle';
import { EmailVerificationTokenRepositoryDrizzle } from '../repositories/drizzle/EmailVerificationTokenRepositoryDrizzle';


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
import { DrizzleMessageMapper } from '../repositories/mappers/DrizzleMappers/DrizzleMessageMapper';
import { DrizzleDiscussionTransferMapper } from '../repositories/mappers/DrizzleMappers/DrizzleDiscussionTransferMapper';
import { DrizzleStockPriceHistoryMapper } from '../repositories/mappers/DrizzleMappers/DrizzleStockPriceHistoryMapper';
import { DrizzleBeneficiaryMapper } from '../repositories/mappers/DrizzleMappers/DrizzleBeneficiaryMapper';


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
  const drizzleMessageMapper = new DrizzleMessageMapper();
  const drizzleDiscussionTransferMapper = new DrizzleDiscussionTransferMapper();
  const drizzleStockPriceHistoryMapper = new DrizzleStockPriceHistoryMapper();
  const drizzleBeneficiaryMapper = new DrizzleBeneficiaryMapper();
  

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
  const portfolioRepository = new PortfolioRepositoryDrizzle(db, drizzlePortfolioMapper, drizzleHoldingMapper);
  const holdingRepository = new HoldingRepositoryDrizzle(db, drizzleHoldingMapper);
  const tradeRepository = new TradeRepositoryDrizzle(db, drizzleTradeMapper);
  const discussionRepository = new DiscussionRepositoryDrizzle(db, drizzleDiscussionMapper);
  const messageRepository = new MessageRepositoryDrizzle(db, drizzleMessageMapper);
  const discussionTransferRepository = new DiscussionTransferRepositoryDrizzle(db, drizzleDiscussionTransferMapper);
  const stockPriceHistoryRepository = new StockPriceHistoryRepositoryDrizzle(db, drizzleStockPriceHistoryMapper);
  const beneficiaryRepository = new BeneficiaryRepositoryDrizzle(db, drizzleBeneficiaryMapper);
  const emailVerificationTokenRepository = new EmailVerificationTokenRepositoryDrizzle(db);
  
  const passwordHasher = new SimplePasswordHasher();
  const emailService = new NodemailerEmailService();

  const profileManager = new ProfileManager(
    clientRepository,
    directorRepository,
    advisorRepository
  );

  const orderMatchingService = new OrderMatchingService(orderRepository, stockRepository, stockPriceHistoryRepository, portfolioRepository, tradeRepository, bankAccountRepository, transactionRepository)
  
  const registerUseCase = new RegisterUseCase(
    userRepository,
    advisorRepository,
    profileManager,
    passwordHasher,
    emailVerificationTokenRepository,
    emailService
  );

  // Email Verification Use Cases
  const verifyEmailUseCase = new VerifyEmailUseCase(emailVerificationTokenRepository, userRepository);
  const resendVerificationEmailUseCase = new ResendVerificationEmailUseCase(userRepository, emailVerificationTokenRepository, emailService);

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
  const renameBankAccountUseCase = new RenameBankAccountUseCase(bankAccountRepository, clientRepository);
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

  const transferFromSavingUseCase = new TransferFromSavingUseCase(
    clientRepository,
    savingRepository,
    bankAccountRepository,
    transactionRepository
  );

  const depositToSavingUseCase = new DepositToSavingUseCase(
    clientRepository,
    savingRepository,
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
  const processScheduledLoanPaymentsUseCase = new ProcessScheduledLoanPaymentsUseCase(loanRepository, bankAccountRepository, transactionRepository);
  const listPendingLoansUseCase = new ListPendingLoansUseCase(loanRepository, advisorRepository, clientRepository);
  const approveLoanUseCase = new ApproveLoanUseCase(loanRepository, bankAccountRepository, transactionRepository, clientRepository);
  const rejectLoanUseCase = new RejectLoanUseCase(loanRepository);
  const listAdvisorClientsUseCase = new ListAdvisorClientsUseCase(loanRepository);

  //Investment Use Cases
  const placeOrderUseCase = new PlaceOrderUseCase(orderRepository, stockRepository, clientRepository, bankAccountRepository, portfolioRepository, transactionRepository, orderMatchingService);
  const cancelOrderUseCase = new CancelOrderUseCase(clientRepository, orderRepository, portfolioRepository, bankAccountRepository, transactionRepository, stockRepository);
  const createPortfolioUseCase = new CreatePortfolioUseCase(clientRepository, portfolioRepository);
  const getMyPortfolioUseCase = new GetMyPortfolioUseCase(clientRepository, portfolioRepository, stockRepository, companyRepository);
  const addCompanyUseCase = new AddCompanyUseCase(companyRepository);
  const getCompanyByIdUseCase = new GetCompanyByIdUseCase(companyRepository);
  const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);
  const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepository, stockRepository);
  const createStockUseCase  = new CreateStockUseCase(stockRepository, companyRepository, userRepository, clientRepository, portfolioRepository, orderRepository);
  const listCompaniesUseCase = new ListCompaniesUseCase(companyRepository);
  const listStockUseCase = new ListStocksUseCase(stockRepository);
  const listMyOrdersUseCase = new ListMyOrdersUseCase(clientRepository, orderRepository, stockRepository);
  const showBestBuyAndSellOrderUseCase = new ShowBestBuyAndSellOrderForStockUseCase(orderRepository, stockRepository);
  const getStockPriceHistoryUseCase = new GetStockPriceHistoryUseCase(stockRepository, stockPriceHistoryRepository);
  const editStockUseCase = new EditStockUseCase(stockRepository);
  const getStockUseCase = new GetStockUseCase(stockRepository, companyRepository);

  // Director Bank Account Management Use Cases
  const createAccountForClientUseCase = new CreateBankAccountForClientUseCase(bankAccountRepository, clientRepository);
  const renameAccountByDirectorUseCase = new RenameBankAccountByDirectorUseCase(bankAccountRepository);
  const deleteAccountByDirectorUseCase = new DeleteBankAccountByDirectorUseCase(bankAccountRepository);

  // Director Client Management Use Cases
  const createClientByDirectorUseCase = new CreateClientByDirectorUseCase(userRepository, advisorRepository, profileManager, passwordHasher);
  const updateClientByDirectorUseCase = new UpdateClientByDirectorUseCase(userRepository, passwordHasher);
  const deleteClientByDirectorUseCase = new DeleteClientByDirectorUseCase(
    userRepository, 
    clientRepository, 
    bankAccountRepository, 
    savingRepository, 
    loanRepository, 
    portfolioRepository, 
    orderRepository, 
    transactionRepository
  );

  // Beneficiary Use Cases
  const addBeneficiaryUseCase = new AddBeneficiaryUseCase(beneficiaryRepository, clientRepository, bankAccountRepository);
  const listUserBeneficiariesUseCase = new ListUserBeneficiariesUseCase(beneficiaryRepository, clientRepository);
  const deleteBeneficiaryUseCase = new DeleteBeneficiaryUseCase(beneficiaryRepository, clientRepository);
  const updateBeneficiaryLabelUseCase = new UpdateBeneficiaryLabelUseCase(beneficiaryRepository, clientRepository);

  // Messaging Use Cases - Client
  const createDiscussionUseCase = new CreateDiscussionUseCase(discussionRepository, clientRepository);
  const listClientDiscussionsUseCase = new ListClientDiscussionsUseCase(discussionRepository, clientRepository, advisorRepository, userRepository);
  const sendClientMessageUseCase = new SendClientMessageUseCase(discussionRepository, messageRepository, clientRepository);
  const getClientDiscussionUseCase = new GetClientDiscussionUseCase(discussionRepository, messageRepository, clientRepository, advisorRepository, userRepository);

  // Messaging Use Cases - Advisor
  const listAdvisorDiscussionsUseCase = new ListAdvisorDiscussionsUseCase(discussionRepository, advisorRepository, userRepository, clientRepository);
  const sendAdvisorMessageUseCase = new SendAdvisorMessageUseCase(discussionRepository, messageRepository, advisorRepository);
  const getAdvisorDiscussionUseCase = new GetAdvisorDiscussionUseCase(discussionRepository, messageRepository, advisorRepository, userRepository, clientRepository);
  const transferDiscussionUseCase = new TransferDiscussionUseCase(discussionRepository, discussionTransferRepository, advisorRepository);
  const listAdvisorsUseCase = new ListAdvisorsUseCase(advisorRepository, userRepository);

  
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
      message: messageRepository,
      discussionTransfer: discussionTransferRepository,
      company: companyRepository,
      stockPriceHistory: stockPriceHistoryRepository,
      beneficiary: beneficiaryRepository,
      emailVerificationToken: emailVerificationTokenRepository,
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

export type Container = ReturnType<typeof createContainer>;

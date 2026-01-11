-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'DIRECTOR', 'ADVISOR', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TRANSFER', 'LOAN_PAYMENT', 'LOAN_DISBURSEMENT', 'STOCK_PURCHASE', 'STOCK_SALE', 'ORDER_REFUND', 'SAVINGS_INTEREST', 'INITIAL_DEPOSIT');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "DiscussionStatus" AS ENUM ('PENDING', 'ASSIGNED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SenderRole" AS ENUM ('CLIENT', 'ADVISOR');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAID_OFF', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PARTIALLY_FILLED', 'EXECUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING_SETTLEMENT', 'SETTLED');

-- CreateTable
CREATE TABLE "User" (
    "userIdentifier" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerifiedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userIdentifier")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "tokenIdentifier" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("tokenIdentifier")
);

-- CreateTable
CREATE TABLE "Client" (
    "clientIdentifier" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "advisorIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("clientIdentifier")
);

-- CreateTable
CREATE TABLE "Director" (
    "directorIdentifier" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("directorIdentifier")
);

-- CreateTable
CREATE TABLE "Advisor" (
    "advisorIdentifier" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("advisorIdentifier")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "accountIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("accountIdentifier")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionIdentifier" TEXT NOT NULL,
    "bankAccountIdentifier" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "direction" "TransactionDirection" NOT NULL,
    "type" "TransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromAccountIdentifier" TEXT,
    "toAccountIdentifier" TEXT,
    "toSavingAccountIdentifier" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionIdentifier")
);

-- CreateTable
CREATE TABLE "Company" (
    "companyIdentifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("companyIdentifier")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "discussionIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "advisorIdentifier" TEXT,
    "subject" TEXT,
    "status" "DiscussionStatus" NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("discussionIdentifier")
);

-- CreateTable
CREATE TABLE "DiscussionTransfer" (
    "transferIdentifier" TEXT NOT NULL,
    "discussionIdentifier" TEXT NOT NULL,
    "fromAdvisorIdentifier" TEXT NOT NULL,
    "toAdvisorIdentifier" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussionTransfer_pkey" PRIMARY KEY ("transferIdentifier")
);

-- CreateTable
CREATE TABLE "Message" (
    "messageIdentifier" TEXT NOT NULL,
    "discussionIdentifier" TEXT NOT NULL,
    "senderIdentifier" TEXT NOT NULL,
    "senderRole" "SenderRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("messageIdentifier")
);

-- CreateTable
CREATE TABLE "Loan" (
    "loanIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "advisorIdentifier" TEXT NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "durationInMonth" INTEGER NOT NULL,
    "mensualities" INTEGER NOT NULL,
    "insuranceMensualities" INTEGER NOT NULL,
    "remainingAmountToPay" INTEGER NOT NULL,
    "annualInterestRate" INTEGER NOT NULL,
    "annualInsuranceRate" INTEGER NOT NULL,
    "status" "LoanStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPaidAt" TIMESTAMP(3),
    "nextToPayAt" TIMESTAMP(3),

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("loanIdentifier")
);

-- CreateTable
CREATE TABLE "Stock" (
    "stockIdentifier" TEXT NOT NULL,
    "companyIdentifier" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("stockIdentifier")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "portfolioIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("portfolioIdentifier")
);

-- CreateTable
CREATE TABLE "Holding" (
    "holdingIdentifier" TEXT NOT NULL,
    "portfolioIdentifier" TEXT NOT NULL,
    "stockIdentifier" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "averagePrice" INTEGER NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("holdingIdentifier")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "stockIdentifier" TEXT NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "initialQuantity" INTEGER NOT NULL,
    "remainingQuantity" INTEGER NOT NULL,
    "limitPrice" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "blockedMoneyAmount" INTEGER,
    "remainingBlockedMoneyAmount" INTEGER,
    "blockedStockQuantity" INTEGER,
    "sellerHoldingAveragePrice" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderIdentifier")
);

-- CreateTable
CREATE TABLE "Trade" (
    "tradeIdentifier" TEXT NOT NULL,
    "stockIdentifier" TEXT NOT NULL,
    "buyOrderIdentifier" TEXT NOT NULL,
    "sellOrderIdentifier" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "TradeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("tradeIdentifier")
);

-- CreateTable
CREATE TABLE "SavingAccount" (
    "accountIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "productIdentifier" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingAccount_pkey" PRIMARY KEY ("accountIdentifier")
);

-- CreateTable
CREATE TABLE "SavingProduct" (
    "savingProductIdentifier" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "rateUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "SavingProduct_pkey" PRIMARY KEY ("savingProductIdentifier")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "beneficiaryIdentifier" TEXT NOT NULL,
    "clientIdentifier" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "accountName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("beneficiaryIdentifier")
);

-- CreateTable
CREATE TABLE "StockPriceHistory" (
    "stockPriceIdentifier" TEXT NOT NULL,
    "stockIdentifier" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockPriceHistory_pkey" PRIMARY KEY ("stockPriceIdentifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userIdentifier_key" ON "Client"("userIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "Director_userIdentifier_key" ON "Director"("userIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_userIdentifier_key" ON "Advisor"("userIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_iban_key" ON "BankAccount"("iban");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_companyIdentifier_key" ON "Stock"("companyIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_ticker_key" ON "Stock"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_clientIdentifier_key" ON "Portfolio"("clientIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "SavingProduct_label_key" ON "SavingProduct"("label");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "User"("userIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "User"("userIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_advisorIdentifier_fkey" FOREIGN KEY ("advisorIdentifier") REFERENCES "Advisor"("advisorIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "User"("userIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "User"("userIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankAccountIdentifier_fkey" FOREIGN KEY ("bankAccountIdentifier") REFERENCES "BankAccount"("accountIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountIdentifier_fkey" FOREIGN KEY ("fromAccountIdentifier") REFERENCES "BankAccount"("accountIdentifier") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountIdentifier_fkey" FOREIGN KEY ("toAccountIdentifier") REFERENCES "BankAccount"("accountIdentifier") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toSavingAccountIdentifier_fkey" FOREIGN KEY ("toSavingAccountIdentifier") REFERENCES "SavingAccount"("accountIdentifier") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_advisorIdentifier_fkey" FOREIGN KEY ("advisorIdentifier") REFERENCES "Advisor"("advisorIdentifier") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionTransfer" ADD CONSTRAINT "DiscussionTransfer_discussionIdentifier_fkey" FOREIGN KEY ("discussionIdentifier") REFERENCES "Discussion"("discussionIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionTransfer" ADD CONSTRAINT "DiscussionTransfer_fromAdvisorIdentifier_fkey" FOREIGN KEY ("fromAdvisorIdentifier") REFERENCES "Advisor"("advisorIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionTransfer" ADD CONSTRAINT "DiscussionTransfer_toAdvisorIdentifier_fkey" FOREIGN KEY ("toAdvisorIdentifier") REFERENCES "Advisor"("advisorIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_discussionIdentifier_fkey" FOREIGN KEY ("discussionIdentifier") REFERENCES "Discussion"("discussionIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderIdentifier_fkey" FOREIGN KEY ("senderIdentifier") REFERENCES "User"("userIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_advisorIdentifier_fkey" FOREIGN KEY ("advisorIdentifier") REFERENCES "Advisor"("advisorIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_companyIdentifier_fkey" FOREIGN KEY ("companyIdentifier") REFERENCES "Company"("companyIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_portfolioIdentifier_fkey" FOREIGN KEY ("portfolioIdentifier") REFERENCES "Portfolio"("portfolioIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_stockIdentifier_fkey" FOREIGN KEY ("stockIdentifier") REFERENCES "Stock"("stockIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_stockIdentifier_fkey" FOREIGN KEY ("stockIdentifier") REFERENCES "Stock"("stockIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_stockIdentifier_fkey" FOREIGN KEY ("stockIdentifier") REFERENCES "Stock"("stockIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_buyOrderIdentifier_fkey" FOREIGN KEY ("buyOrderIdentifier") REFERENCES "Order"("orderIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_sellOrderIdentifier_fkey" FOREIGN KEY ("sellOrderIdentifier") REFERENCES "Order"("orderIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingAccount" ADD CONSTRAINT "SavingAccount_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingAccount" ADD CONSTRAINT "SavingAccount_productIdentifier_fkey" FOREIGN KEY ("productIdentifier") REFERENCES "SavingProduct"("savingProductIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_clientIdentifier_fkey" FOREIGN KEY ("clientIdentifier") REFERENCES "Client"("clientIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockPriceHistory" ADD CONSTRAINT "StockPriceHistory_stockIdentifier_fkey" FOREIGN KEY ("stockIdentifier") REFERENCES "Stock"("stockIdentifier") ON DELETE RESTRICT ON UPDATE CASCADE;

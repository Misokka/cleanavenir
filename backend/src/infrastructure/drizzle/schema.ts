import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // id string (uuid)
  firstname: text('firstname').notNull(),
  lastname: text('lastname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  isActive: integer('is_active').notNull().default(1),
  emailVerifiedAt: text('email_verified_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type UserDrizzle = InferSelectModel<typeof users>; //pour lecture/fetch
export type NewUserDrizzle = InferInsertModel<typeof users>; //pour insert

export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(), // references users.id
  userId: text('user_id').references(() => users.id).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type ClientDrizzle = InferSelectModel<typeof clients>;
export type NewClientDrizzle = InferInsertModel<typeof clients>;

export const advisors = sqliteTable('advisors', {
  id: text('id').primaryKey(), // references users.id
  userId: text('user_id').references(() => users.id).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type AdvisorDrizzle = InferSelectModel<typeof advisors>;
export type NewAdvisorDrizzle = InferInsertModel<typeof advisors>;

export const directors = sqliteTable('directors', {
  id: text('id').primaryKey(), // references users.id
  userId: text('user_id').references(() => users.id).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type DirectorDrizzle = InferSelectModel<typeof directors>;
export type NewDirectorDrizzle = InferInsertModel<typeof directors>;

// Bank accounts table
export const bankAccounts = sqliteTable('bank_accounts', {
  id: text('id').primaryKey(),
  iban: text('iban').notNull().unique(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(), // references users.id
  balance: integer('balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type BankAccountDrizzle = InferSelectModel<typeof bankAccounts>;
export type NewBankAccountDrizzle = InferInsertModel<typeof bankAccounts>;

export const savingProducts = sqliteTable('saving_product', {
  id: text('id').primaryKey(),
  label: text('label').notNull().unique(),
  rate: integer('rate').notNull(), // stored as basis points or per-million (decide convention)
})

export type SavingProductDrizzle = InferSelectModel<typeof savingProducts>;
export type NewSavingProductDrizzle = InferSelectModel<typeof savingProducts>;

export const savingAccounts = sqliteTable('bank_accounts', {
  id: text('id').primaryKey(),
  iban: text('iban').notNull().unique(),
  ownerId: text('owner_id').notNull(), // references users.id
  savingProductId: text('saving_product_id').notNull(),
  label: text('label').notNull(),
  balance: integer('balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type SavingAccountDrizzle = InferSelectModel<typeof savingAccounts>;
export type NewSavingAccountDrizzle = InferInsertModel<typeof savingAccounts>;

// Operations / transactions table
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  direction: text('direction').notNull(), // DEBIT|| CREDIT
  fromAccountId: text('from_account_id'),
  toAccountId: text('to_account_id'),
  type: text('type').notNull(), // e.g. | "TRANSFER" | "LOAN_PAYMENT" | "STOCK_PURCHASE" | "STOCK_SALE" | "SAVINGS_INTEREST" | "INITIAL_DEPOSIT";, 
  description: text('description'),
  createdAt: text('created_at').notNull(),
});

export type TransactionDrizzle = InferSelectModel<typeof transactions>;
export type NewTransactionDrizzle = InferInsertModel<typeof transactions>;

// Savings (epargne)
export const savings = sqliteTable('savings', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  rate: integer('rate').notNull(), 
  balance: integer('balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type SavingDrizzle = InferSelectModel<typeof savings>;
export type NewSavingDrizzle = InferInsertModel<typeof savings>;

// Loans (credits)
export const loans = sqliteTable('loans', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  advisorId: text('advisor_id').notNull(),
  loanAmount: integer('loan_amount').notNull(),
  durationInMonth: integer('duration_in_month').notNull(),
  mensualities: integer('mensualities').notNull(),
  insuranceMensualities: integer('insurance_mensualities').notNull(),
  remainingAmountToPay: integer('remaining_amount_to_pay').notNull(),
  annualInterestRate: integer('annual_interest_rate').notNull(),
  annualInsuranceRate: integer('annual_insurance_rate').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  lastPaidAt: text('last_paid_at'),
  nextToPayAt: text("next_to_pay_at").notNull()
});

export type LoanDrizzle = InferSelectModel<typeof loans>;
export type NewLoanDrizzle = InferInsertModel<typeof loans>;

// Companies
export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull()
});

export type CompanyDrizzle = InferSelectModel<typeof companies>
export type NewCompanyDrizzle = InferInsertModel<typeof companies>;

// Stocks
export const stocks = sqliteTable('stocks', {
  id: text('id').primaryKey(),
  ticker: text('ticker').notNull().unique(),
  companyId: text('company_id').notNull(),
  price: integer('price').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type StockDrizzle = InferSelectModel<typeof stocks>;
export type NewStockDrizzle = InferInsertModel<typeof stocks>;

// Orders (buy/sell)
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  stockId: text('stock_id').notNull(),
  ownerId: text('owner_id').notNull(),
  type: text('type').notNull(), // BUY or SELL
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(), // price in cents
  status: text('status').notNull().default('OPEN'),
  createdAt: text('created_at').notNull(),
});

export type OrderDrizzle = InferSelectModel<typeof orders>;
export type NewOrderDrizzle = InferInsertModel<typeof orders>;

// Holdings
export const holdings = sqliteTable('holdings', {
  id: text('id').primaryKey(),
  portfolioId: text('portfolioId').notNull(),
  stockId: text('stock_id').notNull(),
  quantity: integer('quantity').notNull().default(0),
  averagePrice: integer('average_price').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type HoldingDrizzle = InferSelectModel<typeof holdings>;
export type NewHoldingDrizzle = InferInsertModel<typeof holdings>;

// Portfolio (summary per client)
export const portfolios = sqliteTable('portfolios', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  createdAt: text('created_at').notNull(),
});

export type PortfolioDrizzle = InferSelectModel<typeof portfolios>;
export type NewPortfolioDrizzle = InferInsertModel<typeof portfolios>;

export const trades = sqliteTable('trades', {
  id: text('id').primaryKey(),
  stockId: text('stock_id').notNull(),
  buyOrderId: text('buy_order_id').notNull(),
  sellOrderId: text('sell_order_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  status: text('status').notNull(),
  createdAt: text('createdAt').notNull()
})

export type TradeDrizzle = InferSelectModel<typeof trades>;
export type NewTradeDrizzle = InferInsertModel<typeof trades>;

// Messages / discussions (basic)
export const discussions = sqliteTable('discussions', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull(),
  advisorId: text('advisor_id'),
  subject: text('subject'),
  createdAt: text('created_at').notNull(),
});

export type DiscussionDrizzle = InferSelectModel<typeof discussions>;
export type NewDiscussionDrizzle = InferInsertModel<typeof discussions>;


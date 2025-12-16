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

// Operations / transactions table
export const operations = sqliteTable('operations', {
  id: text('id').primaryKey(),
  fromAccountId: text('from_account_id'),
  toAccountId: text('to_account_id'),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // e.g. TRANSFER, DEBIT, CREDIT
  description: text('description'),
  createdAt: text('created_at').notNull(),
});

export type OperationDrizzle = InferSelectModel<typeof operations>;
export type NewOperationDrizzle = InferInsertModel<typeof operations>;

// Savings (epargne)
export const savings = sqliteTable('savings', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  rate: integer('rate').notNull(), // stored as basis points or per-million (decide convention)
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
  principal: integer('principal').notNull(),
  annualRate: integer('annual_rate').notNull(),
  termMonths: integer('term_months').notNull(),
  monthlyPayment: integer('monthly_payment').notNull(),
  outstanding: integer('outstanding').notNull(),
  createdAt: text('created_at').notNull(),
});

export type LoanDrizzle = InferSelectModel<typeof loans>;
export type NewLoanDrizzle = InferInsertModel<typeof loans>;

// Stocks
export const stocks = sqliteTable('stocks', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull().unique(),
  companyName: text('company_name').notNull(),
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
  ownerId: text('owner_id').notNull(),
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
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type PortfolioDrizzle = InferSelectModel<typeof portfolios>;
export type NewPortfolioDrizzle = InferInsertModel<typeof portfolios>;

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
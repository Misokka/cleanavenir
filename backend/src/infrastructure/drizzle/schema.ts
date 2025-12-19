import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';

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
  userId: text('user_id').notNull().unique().references(() => users.id),
  advisorId: text('advisor_id').notNull().references(() => advisors.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type ClientDrizzle = InferSelectModel<typeof clients>;
export type NewClientDrizzle = InferInsertModel<typeof clients>;

export const advisors = sqliteTable('advisors', {
  id: text('id').primaryKey(), // references users.id
  userId: text('user_id').notNull().unique().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type AdvisorDrizzle = InferSelectModel<typeof advisors>;
export type NewAdvisorDrizzle = InferInsertModel<typeof advisors>;

export const directors = sqliteTable('directors', {
  id: text('id').primaryKey(), // references users.id
  userId: text('user_id').notNull().unique().references(() => users.id),
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
  ownerId: text('owner_id').notNull().references(() => clients.id),
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
  ownerId: text('owner_id').notNull().unique().references(() => clients.id),
  savingProductId: text('saving_product_id').notNull().references(() => savingProducts.id),
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
  accountId: text('account_id').notNull().references(() => bankAccounts.id),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  direction: text('direction').notNull(), // DEBIT|| CREDIT
  fromAccountId: text('from_account_id').references(() => bankAccounts.id),
  toAccountId: text('to_account_id').references(() => bankAccounts.id),
  toSavingAccountId: text('to_saving_account').references(() => savingAccounts.id),
  type: text('type').notNull(), // e.g. | "TRANSFER" | "LOAN_PAYMENT" | "STOCK_PURCHASE" | "STOCK_SALE" | "SAVINGS_INTEREST" | "INITIAL_DEPOSIT";, 
  description: text('description'),
  createdAt: text('created_at').notNull(),
});

export type TransactionDrizzle = InferSelectModel<typeof transactions>;
export type NewTransactionDrizzle = InferInsertModel<typeof transactions>;

// Loans (credits)
export const loans = sqliteTable('loans', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id),
  advisorId: text('advisor_id').notNull().references(() => advisors.id),
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
  companyId: text('company_id').notNull().references(() => companies.id),
  price: integer('price').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type StockDrizzle = InferSelectModel<typeof stocks>;
export type NewStockDrizzle = InferInsertModel<typeof stocks>;

// Orders (buy/sell)
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  stockId: text('stock_id').notNull().references(() => stocks.id),
  ownerId: text('owner_id').notNull().references(() => clients.id),
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
  portfolioId: text('portfolioId').notNull().references(() => portfolios.id),
  stockId: text('stock_id').notNull().references(() => stocks.id),
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
  ownerId: text('owner_id').notNull().unique().references(() => clients.id),
  createdAt: text('created_at').notNull(),
});

export type PortfolioDrizzle = InferSelectModel<typeof portfolios>;
export type NewPortfolioDrizzle = InferInsertModel<typeof portfolios>;

export const trades = sqliteTable('trades', {
  id: text('id').primaryKey(),
  stockId: text('stock_id').notNull().references(() => stocks.id),
  buyOrderId: text('buy_order_id').notNull().references(() => orders.id),
  sellOrderId: text('sell_order_id').notNull().references(() => orders.id),
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
  clientId: text('client_id').notNull().references(() => clients.id),
  advisorId: text('advisor_id').references(() => advisors.id),
  subject: text('subject'),
  createdAt: text('created_at').notNull(),
});

export type DiscussionDrizzle = InferSelectModel<typeof discussions>;
export type NewDiscussionDrizzle = InferInsertModel<typeof discussions>;


//---------------- relations -------------------------

export const usersRelations = relations(users, ({ one }) => ({
  clientProfile: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),

  advisorProfile: one(advisors, {
    fields: [users.id],
    references: [advisors.userId],
  }),

  directorProfile: one(directors, {
    fields: [users.id],
    references: [directors.userId],
  }),
}));


export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),

  bankAccounts: many(bankAccounts),
  savingAccounts: many(savingAccounts),
  orders: many(orders),
  portfolios: one(portfolios, {
    fields: [clients.id],
    references: [portfolios.ownerId]
  }),

  advisor: one(advisors, {
    fields: [clients.advisorId],
    references: [advisors.id]
  }),

  discussions: many(discussions),
  loans: many(loans), 
}));

export const advisorsRelations = relations(advisors, ({ many }) => ({
  loans: many(loans),
  discussions: many(discussions),
  clients: many(clients)
}));

// export const directorsRelations = relations(directors, ({ one, many }) => ({}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({

  owner: one(clients, {
    fields: [bankAccounts.ownerId],
    references: [clients.id]
  }),

  // Toutes les transactions qui appartiennent à ce compte (audit log)
  history: many(transactions, {
    relationName: "transaction_owner" // Doit matcher le nom côté transaction
  }),

  // Toutes les transactions où ce compte a envoyé de l'argent
  sentTransfers: many(transactions, {
    relationName: "transaction_sender"
  }),

  // Toutes les transactions où ce compte a reçu de l'argent
  receivedTransfers: many(transactions, {
    relationName: "transaction_receiver"
  }),
}));

export const savingProductsRelations = relations(savingProducts, ({ many }) => ({
  savingAccounts: many(savingAccounts)
}));

export const savingAccountsRelations = relations(savingAccounts, ({ one, many }) => ({
  owner: one(clients, {
    fields: [savingAccounts.ownerId],
    references: [clients.id]
  }),

  savingProduct: one(savingProducts, {
    fields: [savingAccounts.savingProductId],
    references: [savingProducts.id]
  })
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  // 1. Le compte "propriétaire" de cette ligne de transaction
  account: one(bankAccounts, {
    fields: [transactions.accountId],
    references: [bankAccounts.id],
    relationName: "transaction_owner" // <--- Nom unique 1
  }),

  // 2. Le compte émetteur (Source)
  fromAccount: one(bankAccounts, {
    fields: [transactions.fromAccountId],
    references: [bankAccounts.id],
    relationName: "transaction_sender" // <--- Nom unique 2
  }),

  // 3. Le compte bénéficiaire (Destination)
  toAccount: one(bankAccounts, {
    fields: [transactions.toAccountId],
    references: [bankAccounts.id],
    relationName: "transaction_receiver" // <--- Nom unique 3
  }),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  client: one(clients, {
    fields: [loans.clientId],
    references: [clients.id],
  }),

  advisor: one(advisors, {
    fields: [loans.advisorId],
    references: [advisors.id]
  })
}));

export const companiesRelations = relations(companies, ({ one }) => ({
  stock: one(stocks, {
    fields: [companies.id],
    references: [stocks.companyId]
  })
}));

export const stocksRelations = relations(stocks, ({ one, many }) => ({
  company: one(companies, {
    fields: [stocks.companyId],
    references: [companies.id]
  }),

  orders: many(orders),
  holdings: many(holdings),
  trades: many(trades)
}));

export const odersRelations = relations(orders, ({ one, many }) => ({
  owner: one(clients, {
    fields: [orders.ownerId],
    references: [clients.id]
  }),

  stock: one(stocks, {
    fields: [orders.stockId],
    references: [stocks.id]
  }),

  buyTrades: many(trades, {
    relationName: "buy_trades"
  }),

  sellTrades: many(trades, {
    relationName: "sell_trades"
  }),
}));

export const holdingsRelations = relations(holdings, ({ one, many }) => ({
  portfolio: one(portfolios, {
    fields: [holdings.portfolioId],
    references: [portfolios.id]
  }),

  stock: one(stocks, {
    fields: [holdings.stockId],
    references: [stocks.id]
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  owner: one(clients, {
    fields: [portfolios.ownerId],
    references: [clients.id]
  }),

  holdings: many(holdings)
}));

export const tradesRelations = relations(trades, ({ one, many }) => ({
  stock: one(stocks, {
    fields: [trades.stockId],
    references: [stocks.id]
  }),

  buyOrder: one(orders, {
    fields: [trades.buyOrderId],
    references: [orders.id],
    relationName: "buy_trade"
  }),
  sellOrder: one(orders, {
    fields: [trades.sellOrderId],
    references: [orders.id],
    relationName: "sell_trade"
  }),
}));

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  client: one(clients, {
    fields: [discussions.clientId],
    references: [clients.id]
  }),
  advisor: one(advisors, {
    fields: [discussions.advisorId],
    references: [advisors.id]
  })
}));


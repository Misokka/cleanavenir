import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
CREATE TABLE `advisors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `advisors_user_id_unique` ON `advisors` (`user_id`);--> statement-breakpoint
CREATE TABLE `bank_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`iban` text NOT NULL,
	`name` text NOT NULL,
	`owner_id` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bank_accounts_iban_unique` ON `bank_accounts` (`iban`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `advisors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_user_id_unique` ON `clients` (`user_id`);--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `directors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `directors_user_id_unique` ON `directors` (`user_id`);--> statement-breakpoint
CREATE TABLE `discussions` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`advisor_id` text,
	`subject` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `advisors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `holdings` (
	`id` text PRIMARY KEY NOT NULL,
	`portfolioId` text NOT NULL,
	`stock_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`average_price` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`portfolioId`) REFERENCES `portfolios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`advisor_id` text NOT NULL,
	`loan_amount` integer NOT NULL,
	`duration_in_month` integer NOT NULL,
	`mensualities` integer NOT NULL,
	`insurance_mensualities` integer NOT NULL,
	`remaining_amount_to_pay` integer NOT NULL,
	`annual_interest_rate` integer NOT NULL,
	`annual_insurance_rate` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`last_paid_at` text,
	`next_to_pay_at` text NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`advisor_id`) REFERENCES `advisors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`stock_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`type` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` integer NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolios_owner_id_unique` ON `portfolios` (`owner_id`);--> statement-breakpoint
CREATE TABLE `saving_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`iban` text NOT NULL,
	`owner_id` text NOT NULL,
	`saving_product_id` text NOT NULL,
	`label` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`saving_product_id`) REFERENCES `saving_products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `saving_accounts_iban_unique` ON `saving_accounts` (`iban`);--> statement-breakpoint
CREATE UNIQUE INDEX `saving_accounts_owner_id_unique` ON `saving_accounts` (`owner_id`);--> statement-breakpoint
CREATE TABLE `saving_products` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`rate` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `saving_products_label_unique` ON `saving_products` (`label`);--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` text PRIMARY KEY NOT NULL,
	`ticker` text NOT NULL,
	`company_id` text NOT NULL,
	`price` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_ticker_unique` ON `stocks` (`ticker`);--> statement-breakpoint
CREATE TABLE `trades` (
	`id` text PRIMARY KEY NOT NULL,
	`stock_id` text NOT NULL,
	`buy_order_id` text NOT NULL,
	`sell_order_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` integer NOT NULL,
	`status` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`buy_order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sell_order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`direction` text NOT NULL,
	`from_account_id` text,
	`to_account_id` text,
	`to_saving_account` text,
	`type` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `bank_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_account_id`) REFERENCES `bank_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `bank_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_saving_account`) REFERENCES `saving_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`firstname` text NOT NULL,
	`lastname` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`email_verified_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
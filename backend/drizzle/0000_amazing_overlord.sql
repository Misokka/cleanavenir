CREATE TABLE `bank_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`iban` text NOT NULL,
	`name` text NOT NULL,
	`owner_id` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bank_accounts_iban_unique` ON `bank_accounts` (`iban`);--> statement-breakpoint
CREATE TABLE `discussions` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`advisor_id` text,
	`subject` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `holdings` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`stock_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`average_price` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`principal` integer NOT NULL,
	`annual_rate` integer NOT NULL,
	`term_months` integer NOT NULL,
	`monthly_payment` integer NOT NULL,
	`outstanding` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `operations` (
	`id` text PRIMARY KEY NOT NULL,
	`from_account_id` text,
	`to_account_id` text,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`created_at` text NOT NULL
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
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `savings` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`rate` integer NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` text PRIMARY KEY NOT NULL,
	`symbol` text NOT NULL,
	`company_name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_symbol_unique` ON `stocks` (`symbol`);--> statement-breakpoint
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
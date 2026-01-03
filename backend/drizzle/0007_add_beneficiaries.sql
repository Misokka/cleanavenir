CREATE TABLE `beneficiaries` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`iban` text NOT NULL,
	`label` text NOT NULL,
	`account_name` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_beneficiaries_client_id` ON `beneficiaries` (`client_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_beneficiaries_client_iban` ON `beneficiaries` (`client_id`,`iban`);

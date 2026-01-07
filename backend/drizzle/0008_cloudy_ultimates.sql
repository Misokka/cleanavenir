CREATE TABLE `discussion_transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`discussion_id` text NOT NULL,
	`from_advisor_id` text NOT NULL,
	`to_advisor_id` text NOT NULL,
	`reason` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`discussion_id`) REFERENCES `discussions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_advisor_id`) REFERENCES `advisors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_advisor_id`) REFERENCES `advisors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`discussion_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`sender_role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`discussion_id`) REFERENCES `discussions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `discussions` ADD `status` text DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE `discussions` ADD `updated_at` text NOT NULL;--> statement-breakpoint
ALTER TABLE `saving_products` ADD `rate_updated_at` text;
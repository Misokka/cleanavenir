CREATE TABLE `stock_prices_history` (
	`id` text PRIMARY KEY NOT NULL,
	`stock_id` text NOT NULL,
	`price` integer NOT NULL,
	`recorded_at` text NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `stocks`(`id`) ON UPDATE no action ON DELETE no action
);

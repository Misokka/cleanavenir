ALTER TABLE `orders` RENAME COLUMN "quantity" TO "initial_quantity";--> statement-breakpoint
ALTER TABLE `orders` ADD `remaining_quantity` integer NOT NULL;
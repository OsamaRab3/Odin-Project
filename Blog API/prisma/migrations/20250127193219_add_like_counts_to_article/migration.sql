/*
  Warnings:

  - You are about to drop the column `likesCount` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `likesCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `likesCount`;

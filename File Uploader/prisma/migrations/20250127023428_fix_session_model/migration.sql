/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expires` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` DROP COLUMN `expiresAt`,
    ADD COLUMN `expires` DATETIME(3) NOT NULL,
    MODIFY `data` VARCHAR(191) NOT NULL;

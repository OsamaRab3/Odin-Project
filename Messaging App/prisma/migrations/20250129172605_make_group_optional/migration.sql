/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_groupId_fkey`;

-- DropIndex
DROP INDEX `Message_groupId_fkey` ON `Message`;

-- AlterTable
ALTER TABLE `Chat` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `groupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

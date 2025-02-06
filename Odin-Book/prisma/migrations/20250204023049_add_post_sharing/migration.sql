-- AlterTable
ALTER TABLE `Post` ADD COLUMN `sharedPostId` INTEGER NULL,
    MODIFY `content` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_sharedPostId_fkey` FOREIGN KEY (`sharedPostId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

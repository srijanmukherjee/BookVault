/*
  Warnings:

  - You are about to drop the column `userId` on the `Basket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `Basket` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_userId_fkey";

-- DropIndex
DROP INDEX "Basket_userId_key";

-- AlterTable
ALTER TABLE "Basket" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Basket_userEmail_key" ON "Basket"("userEmail");

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `BasketItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[basketId,productId]` on the table `BasketItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BasketItem" DROP CONSTRAINT "BasketItem_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "BasketItem_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "BasketItem_basketId_productId_key" ON "BasketItem"("basketId", "productId");

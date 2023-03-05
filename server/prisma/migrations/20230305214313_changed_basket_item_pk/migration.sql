/*
  Warnings:

  - The primary key for the `BasketItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BasketItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BasketItem" DROP CONSTRAINT "BasketItem_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "BasketItem_pkey" PRIMARY KEY ("basketId", "productId");

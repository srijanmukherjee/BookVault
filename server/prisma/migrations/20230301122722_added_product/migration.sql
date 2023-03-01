/*
  Warnings:

  - You are about to drop the column `slug` on the `Book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Book_slug_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "slug";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_bookId_key" ON "Product"("bookId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

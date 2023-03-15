/*
  Warnings:

  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailTokenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailTokenId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verified",
ADD COLUMN     "emailTokenId" INTEGER NOT NULL,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailTokenId_key" ON "User"("emailTokenId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_emailTokenId_fkey" FOREIGN KEY ("emailTokenId") REFERENCES "VerificationToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

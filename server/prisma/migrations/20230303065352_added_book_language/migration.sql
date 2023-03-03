-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToLanguage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToLanguage_AB_unique" ON "_BookToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToLanguage_B_index" ON "_BookToLanguage"("B");

-- AddForeignKey
ALTER TABLE "_BookToLanguage" ADD CONSTRAINT "_BookToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToLanguage" ADD CONSTRAINT "_BookToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

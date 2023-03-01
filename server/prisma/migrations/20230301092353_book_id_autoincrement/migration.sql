-- AlterTable
CREATE SEQUENCE book_id_seq;
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT nextval('book_id_seq');
ALTER SEQUENCE book_id_seq OWNED BY "Book"."id";

/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Piece` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_piece_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "piece_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "Piece" DROP CONSTRAINT "Piece_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Piece_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Piece_id_seq";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_piece_id_fkey" FOREIGN KEY ("piece_id") REFERENCES "Piece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

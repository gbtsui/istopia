-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_piece_id_fkey";

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "piece_author_id" TEXT,
ADD COLUMN     "piece_title" TEXT,
ALTER COLUMN "piece_id" DROP NOT NULL;

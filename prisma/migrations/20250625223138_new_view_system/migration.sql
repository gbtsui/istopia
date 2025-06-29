/*
  Warnings:

  - You are about to drop the column `views` on the `Piece` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Piece" DROP COLUMN "views";

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "piece_id" TEXT NOT NULL,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_piece_id_fkey" FOREIGN KEY ("piece_id") REFERENCES "Piece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

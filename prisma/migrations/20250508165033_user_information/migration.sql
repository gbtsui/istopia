-- DropIndex
DROP INDEX "User_display_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about_me" VARCHAR(1023),
ADD COLUMN     "summary_text" VARCHAR(255);

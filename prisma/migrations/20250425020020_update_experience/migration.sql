/*
  Warnings:

  - The `yearsOfExperience` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "yearsOfExperience",
ADD COLUMN     "yearsOfExperience" INTEGER;

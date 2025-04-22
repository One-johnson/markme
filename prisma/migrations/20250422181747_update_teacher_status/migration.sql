/*
  Warnings:

  - You are about to drop the column `employmentStatus` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "employmentStatus",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Fulltime';

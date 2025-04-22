/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "address" TEXT,
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "employmentStatus" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "qualifications" TEXT,
ADD COLUMN     "references" TEXT,
ADD COLUMN     "salaryExpectation" DOUBLE PRECISION,
ADD COLUMN     "yearsOfExperience" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

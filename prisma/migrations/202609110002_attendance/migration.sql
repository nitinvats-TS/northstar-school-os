-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "markedBy" TEXT,
    "studentId" TEXT,
    "teacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceRecord_date_idx" ON "AttendanceRecord"("date");
CREATE INDEX "AttendanceRecord_studentId_date_idx" ON "AttendanceRecord"("studentId", "date");
CREATE INDEX "AttendanceRecord_teacherId_date_idx" ON "AttendanceRecord"("teacherId", "date");
CREATE UNIQUE INDEX "AttendanceRecord_date_studentId_key" ON "AttendanceRecord"("date", "studentId");
CREATE UNIQUE INDEX "AttendanceRecord_date_teacherId_key" ON "AttendanceRecord"("date", "teacherId");

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

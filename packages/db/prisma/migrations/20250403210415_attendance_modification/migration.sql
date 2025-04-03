/*
  Warnings:

  - A unique constraint covering the columns `[student_id,session_id]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_student_id_session_id_key" ON "Attendance"("student_id", "session_id");

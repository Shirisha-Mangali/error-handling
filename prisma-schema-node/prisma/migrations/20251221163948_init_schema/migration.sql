-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "hsptl";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "lab";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "pharmacy";

-- CreateEnum
CREATE TYPE "core"."Role" AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT');

-- CreateTable
CREATE TABLE "hsptl"."doctor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hsptl"."patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hsptl"."appointment" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacy"."medicine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab"."lab_test" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "result" TEXT,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."department" (
    "id" SERIAL NOT NULL,
    "deptName" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "core"."Role" NOT NULL DEFAULT 'PATIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "hsptl"."doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_userId_key" ON "hsptl"."patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "department_deptName_key" ON "core"."department"("deptName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "core"."user"("email");

-- AddForeignKey
ALTER TABLE "hsptl"."doctor" ADD CONSTRAINT "doctor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "core"."department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hsptl"."patient" ADD CONSTRAINT "patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "hsptl"."doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hsptl"."appointment" ADD CONSTRAINT "appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "hsptl"."doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hsptl"."appointment" ADD CONSTRAINT "appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "hsptl"."patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab"."lab_test" ADD CONSTRAINT "lab_test_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "hsptl"."patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

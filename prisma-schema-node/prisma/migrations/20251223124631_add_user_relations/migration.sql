-- AddForeignKey
ALTER TABLE "hsptl"."doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hsptl"."patient" ADD CONSTRAINT "patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "core"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

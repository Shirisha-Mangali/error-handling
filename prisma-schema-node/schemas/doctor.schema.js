import { z } from "zod";

// Validation for creating a doctor
export const createDoctorSchema = z.object({
  name: z.string().min(1, "Doctor name is required"),
  departmentId: z.number().int("Department ID must be an integer"),
  userId: z.number().int("User ID must be an integer")
});

// Validation for updating a doctor
export const updateDoctorSchema = z.object({
  name: z.string().min(1).optional(),
  departmentId: z.number().int().optional(),
  userId: z.number().int().optional()
});

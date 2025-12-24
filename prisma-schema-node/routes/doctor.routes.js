// doctor.routes.js
import express from "express";
import passport from "passport"; // <- ADD THIS
import { createDoctor } from "../controllers/doctor.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createDoctorSchema } from "../schemas/doctor.schema.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import prisma from "../prismaClient.js";
import {
  getDoctorProfile,
  getDoctorPatients
} from "../controllers/doctor.controller.js";
//import passport from "../passport.js";

const router = express.Router();

// Protected route: only ADMIN can create a doctor
router.post(
  "/",
  passport.authenticate("jwt", { session: false }), // JWT auth
  validate(createDoctorSchema),                    // Zod validation
  authorizeRoles("ADMIN"),                         // RBAC
  createDoctor
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const doctors = await prisma.doctor.findMany({
      //include: { user: true }
    });
    res.json(doctors);
  }
);


/**
 * DOCTOR → Get own profile
 */
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("DOCTOR"),
  getDoctorProfile
);

/**
 * DOCTOR → Get own patients
 */
router.get(
  "/patients",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("DOCTOR"),
  getDoctorPatients
);


export default router;

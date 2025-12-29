// doctor.routes.js
import express from "express";
import passport  from "passport";
import { authenticate } from "../middlewares/auth.middleware.js"; // <- ADD THIS
import { createDoctor,uploadProfileImage} from "../controllers/doctor.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createDoctorSchema } from "../schemas/doctor.schema.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import prisma from "../prismaClient.js";
import  {uploadDoctorImage} from "../middlewares/upload.middleware.js";

import {
  getDoctorProfile,
  getDoctorPatients
} from "../controllers/doctor.controller.js";
//import passport from "../passport.js";

const router = express.Router();
//testing
router.get(
  "/",
  authenticate,
  (req, res) => {
    res.json({ message: "Protected doctors route" });
  }
);


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


router.post("/upload-profile",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("DOCTOR"),
  uploadDoctorImage.single("profileImage"),
  uploadProfileImage
)
export default router;

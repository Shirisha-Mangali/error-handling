//patient.routes.js
import express from "express";
//import passport from "../passport.js";

import passport from "passport";
import {
  getAllPatients,
  getMyProfile,
  
} from "../controllers/patient.controller.js";

import { bookAppointment ,getMyAppointments} from "../controllers/appointment.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ADMIN → Get all patients
 */
router.get(
  "/",
  (req, res, next) => {
    console.log(" /patient route HIT");
    next();
  },
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  getAllPatients
);

/**
 * PATIENT → Get own profile
 */
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("PATIENT"),
  getMyProfile
);

/**
 * PATIENT → Own appointments
 */
// router.get(
//   "/appointments",
//   passport.authenticate("jwt", { session: false }),
//   authorizeRoles("PATIENT"),
//   getMyAppointments
// );


//book an appointment
router.post(
  "/appointments",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("PATIENT"),
  bookAppointment
);

//Patient → View own appointments
router.get(
  "/appointments",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("PATIENT"),
  getMyAppointments
);




export default router;

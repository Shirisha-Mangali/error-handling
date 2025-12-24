import express from "express";
import passport from "../passport.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getAllUsers,
  updateUserRole,
  getAllDoctors,
  promoteUserToDoctor
} from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * ADMIN → Get all users
 */
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  getAllUsers
);

/**
 * ADMIN → Update user role
 */
router.patch(
  "/users/:id/role",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  updateUserRole
);


/**
 * ADMIN → Promote user to doctor
 */
router.post(
  "/promote/doctor",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  promoteUserToDoctor
);


//get All doctors
router.get(
  "/doctors",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  getAllDoctors
);


export default router;

//auth.routes.js
import express from "express";
import passport from "../passport.js"; // import the file you created
const router = express.Router();

// Redirect to Google for login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"],
    prompt: "select_account" 
   })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
      // JWT is available in req.user.token
      res.json({
          message: "Google login successful",
          token: req.user.token,
          user: {
              id: req.user.id,
              name: req.user.name,
              email: req.user.email,
              role: req.user.role
          }
      });
  }
);

export default router;

// passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { jwtStrategy } from "./middlewares/jwt.strategy.js";

import prisma from "./prismaClient.js";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
//  Register JWT strategy HERE
passport.use(jwtStrategy);


// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    //callbackURL: "https://authapp-umg6.onrender.com/auth/google/callback",
    //This function runs ONLY AFTER: Google verifies the user
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists in DB
        let user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
        });

        if (!user) {
            // Create new user if not exists
            user = await prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    role: "PATIENT", // default role
                },
            });
        }

        //  AUTO-CREATE PATIENT PROFILE
        if (user.role === "PATIENT") {
          const existingPatient = await prisma.patient.findUnique({
            where: { userId: user.id },
          });

          if (!existingPatient) {
            await prisma.patient.create({
              data: {
                name: user.name,
                userId: user.id,
                doctorId: 1, // default doctor (temporary)
              },
            });
          }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Attach token to user object--done(error, user)

        return done(null, { ...user, token });
    } catch (err) {
        done(err, null);
    }
}));

export default passport;

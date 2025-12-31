//jwt.strategy.js
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import prisma from "../prismaClient.js";

// Load .env first
// dotenv.config({
//   path: `.env.${process.env.NODE_ENV || "development"}`,
//   override: true,
// });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in your environment variables");
}
//This runs when:passport.authenticate("jwt") is used.
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // MUST be defined
};
/*Passport uses this to:
Verify signature
Reject fake tokens*/

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    console.log(" JWT STRATEGY CALLED");
    console.log("JWT PAYLOAD:", payload);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
        console.log("JWT PAYLOAD:", payload);

    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

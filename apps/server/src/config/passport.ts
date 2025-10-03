import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { users } from "../modules/users/schema/user.schema";
import { eq } from "drizzle-orm";
import { db } from "../db";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload: {id: number}, done: VerifiedCallback) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, jwtPayload.id));
      if (user) {
        return done(null, user.id);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;

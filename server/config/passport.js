// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
// const bcrypt = require("bcryptjs");
// const prisma = require("../db/prisma");
// const db = require("../db/queries");

// modules syntax

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import * as db from "../db/queries.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect username or password" });

      //golden ticket
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // reads "Authorization: Bearer <token>"
      secretOrKey: process.env.JWT_SECRET,                      // same secret as jwt.sign
    },
    async (payload, done) => {
      try {
        const user = await db.getUserById(payload.sub);
        if (!user) return done(null, false);
        return done(null, user); // becomes req.user
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

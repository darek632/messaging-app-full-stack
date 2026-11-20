import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import * as db from "../db/queries.js";

export const signUpPost = async (req, res, next) => {

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await db.createUser(req.body.username,hashed)
    res.status(201).json({user});

};

export const logInPost = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Incorrect username or password" });
    }

    const safeUser = { id: user.id, username: user.username};
    // user without password being sent
    
    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token, user: safeUser });
  })(req, res, next);
};


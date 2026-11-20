import "dotenv/config";
import express from "express";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";
import authRouter from "./routes/authRouter.js"


const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRouter);



app.use((err, req, res, next) => {
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Not found" });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Already exists" });
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));

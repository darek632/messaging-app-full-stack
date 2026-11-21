import { Router } from "express";
import * as userController from "../controllers/userController.js";
import  requireAuth from "../middleware/auth.js";

const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get("/", userController.listUsers);

userRouter.get("/me", userController.getMe);

userRouter.patch("/me", userController.updateMe);
userRouter.get("/:userId", userController.getUser);

export default userRouter;
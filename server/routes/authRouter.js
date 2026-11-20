import {Router} from "express"
import * as authController from "../controllers/authController.js" 
import requireAuth  from "../middleware/auth.js";


const authRouter = Router();


authRouter.get("/me",requireAuth, (req,res) => res.json(req.user));

authRouter.post("/sign-up", authController.signUpPost);

authRouter.post("/log-in", authController.logInPost);


export default authRouter;
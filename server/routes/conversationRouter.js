import { Router } from "express";
import * as conversationController from "../controllers/conversationController.js";
import  requireAuth  from "../middleware/auth.js";

const conversationRouter = Router();

conversationRouter.use(requireAuth); 
// authentication with JWT on every route here

conversationRouter.get("/", conversationController.listConversations);
conversationRouter.post("/", conversationController.startConversation);

conversationRouter.get("/:conversationId/messages", conversationController.getMessages);
conversationRouter.post("/:conversationId/messages", conversationController.sendMessage);

export default conversationRouter;


import { body, param, validationResult, query } from "express-validator";
import * as db from "../db/queries.js";

const validateStart = [
  body("recipientId").isInt({ min: 1 }).withMessage("recipientId must be a user id").toInt(),
];

const validateConversationId = [
  param("conversationId").isInt({ min: 1 }).toInt(),
];


const validateMessageBody = [
  body("body")
    .trim()
    .notEmpty()
    .withMessage("Message can't be empty")
    .isLength({ max: 2000 })
    .withMessage("Message is too long"),
];



export const startConversation = [
  validateStart,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userId = req.user.id;
    const { recipientId } = req.body;

    if (recipientId === userId) {
      return res.status(400).json({ error: "You can't message yourself" });
    }

    const recipient = await db.getUserById(recipientId);
    if (!recipient) return res.status(404).json({ error: "User not found" });

    const existing = await db.findConversationBetween(userId, recipientId);
    if (existing) return res.json({ conversation: existing });

    const conversation = await db.createConversation(userId, recipientId);
    res.status(201).json({ conversation });
  },
];

export const sendMessage = [
  validateConversationId,
  validateMessageBody,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { conversationId } = req.params;

    const allowed = await db.isParticipant(conversationId, req.user.id);
    if (!allowed) return res.status(403).json({ error: "Not part of this conversation" });

    const message = await db.createMessage(conversationId, req.user.id, req.body.body);
    res.status(201).json({ message });
  },
];

export const listConversations = async (req, res) => {
  const conversations = await db.getConversationsForUser(req.user.id);

  const inbox = conversations
    .map((c) => ({
      id: c.id,
      otherUser: c.participants[0]?.user ?? null,
      lastMessage: c.messages[0] ?? null,
      createdAt: c.createdAt,
    }))
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ?? a.createdAt;
      const bTime = b.lastMessage?.createdAt ?? b.createdAt;
      return bTime - aTime;
    });

  res.json({ conversations: inbox });
};

export const getMessages = [
  validateConversationId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { conversationId } = req.params;

    const allowed = await db.isParticipant(conversationId, req.user.id);
    if (!allowed) return res.status(403).json({ error: "Not part of this conversation" });

    const messages = await db.getMessages(conversationId);
    res.json({ messages });
  },
];





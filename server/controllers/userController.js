import { body, param, validationResult, query } from "express-validator";
import * as db from "../db/queries.js";

const validateSearch = [
  query("search").optional().trim().isLength({ max: 50 }),
];

const validateUserId = [
  param("userId").isInt({ min: 1 }).toInt(),
];

const validateProfile = [
  body("displayName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Display name must be 50 characters or fewer"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Bio must be 300 characters or fewer"),
  body("avatarUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Avatar must be a valid URL"),
];

const emptyToNull = (value) => (value === "" ? null : value); 
//to not break profile customisation


export const listUsers = [
  validateSearch,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const users = await db.searchUsers(req.query.search, req.user.id);
    res.json({ users });
  },
];

export const getMe = async (req, res) => {
  const user = await db.getUserProfile(req.user.id);
  res.json({ user });
};

export const getUser = [
  validateUserId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await db.getUserProfile(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  },
];

export const updateMe = [
  validateProfile,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { displayName, bio, avatarUrl } = req.body;

    const user = await db.updateUserProfile(req.user.id, {
      displayName: emptyToNull(displayName),
      bio: emptyToNull(bio),
      avatarUrl: emptyToNull(avatarUrl),
    });

    res.json({ user });
  },
];
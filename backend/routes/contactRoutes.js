const express = require("express");
const { body } = require("express-validator");
const {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    getTags,
} = require("../controllers/contactController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Validation 
const contactValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 255 })
        .withMessage("Name must be less than 255 characters"),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone is required")
        .isLength({ max: 50 })
        .withMessage("Phone must be less than 50 characters"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("company")
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage("Company must be less than 255 characters"),
    body("tags")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Tags must be less than 500 characters"),
    body("notes")
        .optional()
        .trim(),
    body("is_favorite")
        .optional()
        .isBoolean()
        .withMessage("is_favorite must be a boolean"),
];

//authentication
router.use(authMiddleware);

// Routes
router.get("/", getContacts);
router.get("/tags", getTags);
router.get("/:id", getContactById);
router.post("/", contactValidation, createContact);
router.put("/:id", contactValidation, updateContact);
router.delete("/:id", deleteContact);
router.patch("/:id/favorite", toggleFavorite);

module.exports = router;

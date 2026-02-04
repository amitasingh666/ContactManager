const { validationResult } = require("express-validator");
const db = require("../config/db");

// Get all contacts for logged-in user
const getContacts = async (req, res) => {
    try {
        const { search, favorite, tag, page = 1, limit = 50 } = req.query;
        const userId = req.userId;

        let query = "SELECT * FROM contacts WHERE user_id = ?";
        const params = [userId];

        // Add search filter
        if (search) {
            query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)";
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // Add favorite filter
        if (favorite === "true") {
            query += " AND is_favorite = TRUE";
        }

        // Add tag filter
        if (tag) {
            query += " AND tags LIKE ?";
            params.push(`%${tag}%`);
        }

        // Add ordering
        query += " ORDER BY created_at DESC";

        // Add pagination
        const offset = (page - 1) * limit;
        query += " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), parseInt(offset));

        const [contacts] = await db.query(query, params);

        // Get total count for pagination
        let countQuery = "SELECT COUNT(*) as total FROM contacts WHERE user_id = ?";
        const countParams = [userId];

        if (search) {
            countQuery += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)";
            const searchPattern = `%${search}%`;
            countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (favorite === "true") {
            countQuery += " AND is_favorite = TRUE";
        }

        if (tag) {
            countQuery += " AND tags LIKE ?";
            countParams.push(`%${tag}%`);
        }

        const [countResult] = await db.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            contacts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get contacts error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching contacts",
        });
    }
};

// Get single contact by ID
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const [contacts] = await db.query(
            "SELECT * FROM contacts WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (contacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.json({
            success: true,
            contact: contacts[0],
        });
    } catch (error) {
        console.error("Get contact error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching contact",
        });
    }
};

// Create new contact
const createContact = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { name, phone, email, company, tags, notes, is_favorite } = req.body;
        const userId = req.userId;

        const [result] = await db.query(
            "INSERT INTO contacts (user_id, name, phone, email, company, tags, notes, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                userId,
                name,
                phone,
                email,
                company || null,
                tags || null,
                notes || null,
                is_favorite || false,
            ]
        );

        const [newContact] = await db.query(
            "SELECT * FROM contacts WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            contact: newContact[0],
        });
    } catch (error) {
        console.error("Create contact error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating contact",
        });
    }
};

// Update contact
const updateContact = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { id } = req.params;
        const { name, phone, email, company, tags, notes, is_favorite } = req.body;
        const userId = req.userId;

        // Check if contact exists and belongs to user
        const [existingContacts] = await db.query(
            "SELECT id FROM contacts WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (existingContacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        await db.query(
            "UPDATE contacts SET name = ?, phone = ?, email = ?, company = ?, tags = ?, notes = ?, is_favorite = ? WHERE id = ? AND user_id = ?",
            [name, phone, email, company || null, tags || null, notes || null, is_favorite || false, id, userId]
        );

        const [updatedContact] = await db.query(
            "SELECT * FROM contacts WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Contact updated successfully",
            contact: updatedContact[0],
        });
    } catch (error) {
        console.error("Update contact error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating contact",
        });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Check if contact exists and belongs to user
        const [existingContacts] = await db.query(
            "SELECT id FROM contacts WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (existingContacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        await db.query("DELETE FROM contacts WHERE id = ? AND user_id = ?", [
            id,
            userId,
        ]);

        res.json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        console.error("Delete contact error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting contact",
        });
    }
};

// Toggle favorite status
const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Check if contact exists and belongs to user
        const [existingContacts] = await db.query(
            "SELECT is_favorite FROM contacts WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (existingContacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        const newFavoriteStatus = !existingContacts[0].is_favorite;

        await db.query(
            "UPDATE contacts SET is_favorite = ? WHERE id = ? AND user_id = ?",
            [newFavoriteStatus, id, userId]
        );

        res.json({
            success: true,
            message: `Contact ${newFavoriteStatus ? "added to" : "removed from"} favorites`,
            is_favorite: newFavoriteStatus,
        });
    } catch (error) {
        console.error("Toggle favorite error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while toggling favorite",
        });
    }
};

// Get all unique tags
const getTags = async (req, res) => {
    try {
        const userId = req.userId;

        const [contacts] = await db.query(
            "SELECT tags FROM contacts WHERE user_id = ? AND tags IS NOT NULL AND tags != ''",
            [userId]
        );

        // Extract and deduplicate tags
        const tagsSet = new Set();
        contacts.forEach((contact) => {
            if (contact.tags) {
                const tagArray = contact.tags.split(",").map((tag) => tag.trim());
                tagArray.forEach((tag) => {
                    if (tag) tagsSet.add(tag);
                });
            }
        });

        const tags = Array.from(tagsSet).sort();

        res.json({
            success: true,
            tags,
        });
    } catch (error) {
        console.error("Get tags error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching tags",
        });
    }
};

module.exports = {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    getTags,
};

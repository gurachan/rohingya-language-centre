 // ==========================================
// Rohingya Language Centre
// Dictionary Routes
// ==========================================

const express = require("express");
const router = express.Router();

const dictionaryController = require("./dictionary.controller");

// ==========================================
// Dictionary Routes
// ==========================================

// Get all dictionary words
router.get(
    "/words",
    dictionaryController.getAllWords
);

// Create a new dictionary word
router.post(
    "/add",
    dictionaryController.addDictionary
);

// ==========================================

module.exports = router;
 // ==========================================
// Rohingya Language Centre
// Dictionary Admin Routes
// ==========================================

const express = require("express");

const router = express.Router();

const dictionaryController =
    require("./dictionary.controller");


// ==========================================
// Get All Dictionary Words
// ==========================================

router.get(
    "/words",
    dictionaryController.getAllWords
);


// ==========================================
// Create New Dictionary Word
// ==========================================

router.post(
    "/add",
    dictionaryController.addDictionary
);

// ==========================================
// Get Meanings By Dictionary Word ID
// ==========================================

router.get(
    "/:wordId/meanings",
    dictionaryController.getMeanings
);

// ==========================================
// Add Meaning to Existing Dictionary Word
// ==========================================

router.post(
    "/:wordId/meanings",
    dictionaryController.addMeaning
);


// ==========================================

module.exports = router;
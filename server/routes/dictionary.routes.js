const express = require("express");

const router = express.Router();

const dictionaryController = require("../controllers/dictionary.controller");


router.get(
    "/:word",
    dictionaryController.searchWord
);


module.exports = router;
 // ==========================================
// Rohingya Language Centre
// Dictionary Admin Controller
// ==========================================

const db = require("../config/database");

const dictionaryModel = require("./dictionary.model");
const meaningModel = require("./meaning.model");


// ==========================================
// Get All Dictionary Words
// ==========================================

async function getAllWords(req, res) {

    try {

        const words = await dictionaryModel.getAllWords();

        res.json({
            success: true,
            total: words.length,
            data: words
        });

    } catch (error) {

        console.error("GET ALL WORDS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

}


// ==========================================
// Add Dictionary Word
// ==========================================

async function addDictionary(req, res) {

    const {
        english_word,
        ipa_uk,
        ipa_us,
        part_of_speech,
        category_id,
        status,
        meanings
    } = req.body;

    // ==========================================
    // Validation
    // ==========================================

    if (!english_word || !english_word.trim()) {
        return res.status(400).json({
            success: false,
            message: "English word is required."
        });
    }

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // ==========================================
        // Create dictionary word
        // ==========================================

        const wordId = await dictionaryModel.addWord(
            connection,
            {
                english_word,
                ipa_uk,
                ipa_us,
                part_of_speech,
                category_id,
                status
            }
        );

        // ==========================================
        // Create meanings
        // ==========================================

        if (Array.isArray(meanings)) {

            for (const meaning of meanings) {

                await meaningModel.addMeaning(
                    connection,
                    wordId,
                    meaning
                );

            }

        }

        // ==========================================
        // Commit
        // ==========================================

        await connection.commit();

        return res.json({
            success: true,
            message: "Dictionary word created successfully.",
            wordId
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "ADD DICTIONARY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create dictionary word."
        });

    } finally {

        connection.release();

    }
}
// ==========================================
// Add Meaning to Existing Dictionary Word
// ==========================================

async function addMeaning(req, res) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();


        // Get dictionary word ID

        const wordId = Number(
            req.params.wordId
        );


        // Request data

        const {
            meaning_order,
            part_of_speech,
            english_definition,
            hanifi_meaning,
            examples
        } = req.body;


        // ==========================================
        // Validation
        // ==========================================

        if (!wordId) {

            return res.status(400).json({
                success: false,
                message: "Invalid dictionary word ID."
            });

        }


        if (!part_of_speech) {

            return res.status(400).json({
                success: false,
                message: "Part of speech is required."
            });

        }


        if (!english_definition) {

            return res.status(400).json({
                success: false,
                message: "English definition is required."
            });

        }


        if (!hanifi_meaning) {

            return res.status(400).json({
                success: false,
                message: "Hanifi meaning is required."
            });

        }


        // ==========================================
        // Check Dictionary Word
        // ==========================================

        const [words] = await connection.query(
            `
            SELECT id
            FROM dictionary_words
            WHERE id = ?
            `,
            [wordId]
        );


        if (words.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Dictionary word not found."
            });

        }


        // ==========================================
        // Create Meaning
        // ==========================================

        const meaningId =
            await meaningModel.addMeaning(
                connection,
                wordId,
                {
                    meaning_order:
                        meaning_order || 1,

                    part_of_speech:
                        part_of_speech,

                    english_definition:
                        english_definition,

                    hanifi_meaning:
                        hanifi_meaning,

                    examples:
                        Array.isArray(examples)
                            ? examples
                            : []
                }
            );


        // ==========================================
        // Commit
        // ==========================================

        await connection.commit();


        res.json({
            success: true,
            message:
                "Dictionary meaning created successfully.",
            meaningId
        });


    } catch (error) {

        await connection.rollback();

        console.error(
            "ADD MEANING ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to create dictionary meaning."
        });


    } finally {

        connection.release();

    }

}


// ==========================================
// Module Exports
// ==========================================

module.exports = {

    getAllWords,

    addDictionary,

    addMeaning,

    getMeanings

};
// ==========================================
// Get Meanings By Word ID
// ==========================================

async function getMeanings(req, res) {

    try {

        const wordId = Number(req.params.wordId);


        if (!wordId) {

            return res.status(400).json({
                success:false,
                message:"Invalid word ID."
            });

        }


        const [rows] = await db.query(
            `
            SELECT
                id,
                meaning_order,
                part_of_speech,
                english_definition,
                hanifi_meaning
            FROM dictionary_meanings
            WHERE word_id = ?
            ORDER BY meaning_order ASC
            `,
            [wordId]
        );


        res.json({

            success:true,
            meanings:rows

        });


    } catch(error){

        console.error(
            "GET MEANINGS ERROR:",
            error
        );


        res.status(500).json({

            success:false,
            message:"Failed to load meanings."

        });

    }

}
 const db = require("../config/database");

const dictionaryModel = require("./dictionary.model");
const meaningModel = require("./meaning.model");

async function getAllWords(req, res) {

    try {

        const words = await dictionaryModel.getAllWords();

        res.json({
            success: true,
            total: words.length,
            data: words
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

}

async function addDictionary(req, res) {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Create dictionary word
        const wordId = await dictionaryModel.addWord(
            connection,
            req.body
        );

        // Create all meanings
        if (req.body.meanings && req.body.meanings.length > 0) {

            for (const meaning of req.body.meanings) {

                await meaningModel.addMeaning(
                    connection,
                    wordId,
                    meaning
                );

            }

        }

        await connection.commit();

        res.json({
            success: true,
            message: "Dictionary word created successfully.",
            wordId
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create dictionary word."
        });

    } finally {

        connection.release();

    }

}

module.exports = {
    getAllWords,
    addDictionary
};
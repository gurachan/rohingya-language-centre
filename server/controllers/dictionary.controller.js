 const dictionaryModel = require("../models/dictionary.model");


async function searchWord(req, res) {

    try {

        const { word } = req.params;


        if (!word) {

            return res.status(400).json({
                success: false,
                message: "Word is required"
            });

        }


        const result = await dictionaryModel.findWord(word);


        if (result.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Word not found"
            });

        }


        return res.status(200).json({

            success: true,
            count: result.length,
            data: result

        });


    } catch (error) {

        console.error("DICTIONARY SEARCH ERROR:");
        console.error(error.sqlMessage || error.message);


        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

}


module.exports = {
    searchWord
};
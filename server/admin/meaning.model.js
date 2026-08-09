 // ==========================================
// Rohingya Language Centre
// Dictionary Meaning Model
// ==========================================

const exampleModel = require("./example.model");


// ==========================================
// Add Meaning
// ==========================================

async function addMeaning(connection, wordId, meaning) {

    const [result] = await connection.query(
        `
        INSERT INTO dictionary_meanings
        (
            word_id,
            meaning_order,
            part_of_speech,
            english_definition,
            hanifi_meaning
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
            wordId,
            meaning.meaning_order,
            meaning.part_of_speech,
            meaning.english_definition,
            meaning.hanifi_meaning
        ]
    );


    const meaningId = result.insertId;


    // Add examples if provided

    if (
        meaning.examples &&
        meaning.examples.length > 0
    ) {

        for (const example of meaning.examples) {

            await exampleModel.addExample(
                connection,
                meaningId,
                example
            );

        }

    }


    return meaningId;

}


// ==========================================
// Get Meanings By Word ID
// ==========================================

async function getMeaningsByWordId(
    connection,
    wordId
) {

    const [rows] = await connection.query(
        `
        SELECT
            id,
            word_id,
            meaning_order,
            part_of_speech,
            english_definition,
            hanifi_meaning,
            created_at,
            updated_at
        FROM dictionary_meanings
        WHERE word_id = ?
        ORDER BY meaning_order ASC, id ASC
        `,
        [wordId]
    );


    return rows;

}


// ==========================================
// Export
// ==========================================

module.exports = {

    addMeaning,

    getMeaningsByWordId

};
 const exampleModel = require("./example.model");

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

    if (meaning.examples && meaning.examples.length > 0) {

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

module.exports = {
    addMeaning
};
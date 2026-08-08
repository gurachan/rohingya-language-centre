 const db = require("../config/database");

async function findWord(word) {

    const query = `
        SELECT
            dw.id AS word_id,
            dw.english_word,
            dw.ipa,

            dm.id AS meaning_id,
            dm.meaning_order,
            dm.part_of_speech,
            dm.english_definition,
            dm.hanifi_meaning,

            e.id AS example_id,
            e.english_example,
            e.hanifi_example

        FROM dictionary_words dw

        LEFT JOIN dictionary_meanings dm
            ON dw.id = dm.word_id

        LEFT JOIN examples e
            ON dm.id = e.meaning_id

        WHERE dw.english_word = ?
        AND dw.status = 'published'

        ORDER BY
            dm.meaning_order,
            e.id;
    `;

    const [rows] = await db.query(query, [word]);

    return rows;
}

module.exports = {
    findWord
};
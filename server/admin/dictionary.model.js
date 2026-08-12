const db = require("../config/database");

// ==========================================
// Get All Dictionary Words
// ==========================================

async function getAllWords() {
    const [rows] = await db.query(`
        SELECT
            id,
            english_word,
            slug,
            ipa_uk,
            ipa_us,
            part_of_speech,
            category_id,
            status,
            created_at
        FROM dictionary_words
        ORDER BY english_word ASC
    `);

    return rows;
}

// ==========================================
// Add New Dictionary Word
// ==========================================

async function addWord(connection, word) {

    const englishWord = word.english_word
        .trim();

    const slug = englishWord
        .toLowerCase()
        .replace(/\s+/g, "-");

    const [result] = await connection.query(
        `
        INSERT INTO dictionary_words
        (
            english_word,
            slug,
            ipa_uk,
            ipa_us,
            part_of_speech,
            category_id,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            englishWord,
            slug,
            word.ipa_uk || null,
            word.ipa_us || null,
            word.part_of_speech || null,
            word.category_id || null,
            word.status || "draft"
        ]
    );

    return result.insertId;
}

// ==========================================
// Export
// ==========================================

module.exports = {
    getAllWords,
    addWord
};

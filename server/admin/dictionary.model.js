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

    // Generate slug automatically
    const slug = word.english_word
        .toLowerCase()
        .trim()
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
VALUES
(?,?,?,?,?,?,?)
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
            word.english_word,
            slug,
            word.part_of_speech,
            word.category_id,
            word.status || "draft"
        ]
    );

    return result.insertId;
}


// ==========================================

module.exports = {
    getAllWords,
    addWord
};
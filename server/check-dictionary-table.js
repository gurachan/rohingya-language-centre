require("dotenv").config();

const db = require("./config/database");

async function checkTable() {
    try {
        const [columns] = await db.query(`
            DESCRIBE dictionary_words
        `);

        console.log("\n=== LIVE dictionary_words TABLE ===\n");
        console.table(columns);

        process.exit(0);

    } catch (error) {
        console.error("\n❌ DATABASE CHECK FAILED\n");
        console.error(error);

        process.exit(1);
    }
}

checkTable();

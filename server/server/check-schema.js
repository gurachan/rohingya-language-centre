const db = require("../config/database");

async function checkSchema() {
    try {

        console.log("Connected to database");

        const [tables] = await db.query("SHOW TABLES");

        console.log("\n=== TABLES ===");
        console.table(tables);


        console.log("\n=== dictionary_words ===");
        const [dictionary] = await db.query(
            "DESCRIBE dictionary_words"
        );
        console.table(dictionary);


        console.log("\n=== rohingya_meanings ===");
        const [meanings] = await db.query(
            "DESCRIBE rohingya_meanings"
        );
        console.table(meanings);


        console.log("\n=== examples ===");
        const [examples] = await db.query(
            "DESCRIBE examples"
        );
        console.table(examples);


        process.exit(0);

    } catch (error) {

        console.error("DATABASE CHECK ERROR");
        console.error(error);

        process.exit(1);

    }
}

checkSchema();
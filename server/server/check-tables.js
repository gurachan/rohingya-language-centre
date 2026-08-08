const db = require("./config/database");

async function checkTables() {

    try {

        const [tables] = await db.query("SHOW TABLES");

        console.log("DATABASE TABLES:");
        console.log(tables);

        process.exit(0);

    } catch (error) {

        console.error(error.message);
        process.exit(1);

    }

}

checkTables();
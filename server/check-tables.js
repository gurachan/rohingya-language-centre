const db = require("./config/database");

async function checkTables() {
    const [tables] = await db.query("SHOW TABLES");

    console.log(tables);

    process.exit();
}

checkTables();
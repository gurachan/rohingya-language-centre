const db = require("./config/database");

async function check() {
    const [rows] = await db.query("SHOW CREATE TABLE examples");

    console.log(rows[0]["Create Table"]);

    process.exit();
}

check().catch(console.error);
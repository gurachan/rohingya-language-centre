require("dotenv").config();

const fs = require("fs");
const mysql = require("mysql2/promise");

async function runMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    const sql = fs.readFileSync(
        "./database/migrations/010_update_examples_table.sql",
        "utf8"
    );

    await connection.query(sql);

    console.log("Migration completed.");

    await connection.end();
}

runMigration().catch(console.error);
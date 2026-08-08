require("dotenv").config();

const fs = require("fs");
const mysql = require("mysql2/promise");

async function addWord() {

    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });


    const sql = fs.readFileSync(
        "./database/test-word.sql",
        "utf8"
    );


    await db.query(sql);

    console.log("Test word added successfully");

    await db.end();
}


addWord();
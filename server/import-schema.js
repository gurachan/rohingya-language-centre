require("dotenv").config();

const fs = require("fs");
const mysql = require("mysql2/promise");

async function importSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    const schema = fs.readFileSync("./database/schema.sql", "utf8");
const result = await connection.query(schema);

console.log(result);
console.log("Schema imported successfully");
    await connection.end();
}

importSchema().catch(error => {
    console.error("Import failed:");
    console.error(error.message);
});
const db = require("./config/database");

async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log("==================================");
        console.log("✅ MySQL Database Connected!");
        console.log("==================================");

        connection.release();
        process.exit(0);

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error);

        process.exit(1);
    }
}

testConnection();
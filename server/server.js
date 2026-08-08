 require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {

    console.log("==================================");
    console.log(" Rohingya Language Centre Server");
    console.log(" Running on Port:", PORT);
    console.log("==================================");

});


process.on("uncaughtException", (error) => {

    console.error("UNCAUGHT ERROR:");
    console.error(error);

});


process.on("unhandledRejection", (error) => {

    console.error("UNHANDLED PROMISE ERROR:");
    console.error(error);

});
server.on("close", () => {
    console.log("❌ SERVER CLOSED");
});

server.on("error", (error) => {
    console.error("❌ SERVER ERROR");
    console.error(error);
});
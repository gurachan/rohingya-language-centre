 // ==========================================
// Rohingya Language Centre
// Main Express Application
// ==========================================

console.log("APP.JS LOADED");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

const dictionaryRoutes = require("./routes/dictionary.routes");
const adminDictionaryRoutes = require("./admin/dictionary.routes");

dotenv.config();

const app = express();

// ==========================================
// Security
// ==========================================

app.use(helmet());

// ==========================================
// CORS
// ==========================================

app.use(cors());

// ==========================================
// Body Parser
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Cookies
// ==========================================

app.use(cookieParser());

// ==========================================
// Logger
// ==========================================

app.use(morgan("dev"));

// ==========================================
// API Routes
// ==========================================

app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/admin/dictionary", adminDictionaryRoutes);

// ==========================================
// Frontend
// ==========================================

app.use(express.static(
    path.join(__dirname, "../data/client")
));

// ==========================================
// Backend Test Route
// ==========================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        project: "Rohingya Language Centre",
        version: "1.0",
        message: "Backend Server Running Successfully"
    });

});

// ==========================================
// Default Page
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../data/client/index.html"
        )
    );

});

// ==========================================

module.exports = app;
const express = require("express");
const path = require("path");
const app = express();
const env = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const cors = require("cors");

env.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
    "http://localhost:5173",
    "https://listmanagement-backend.onrender.com",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello World! /^^/");
});

app.use("/api/user", userRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
    mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch(err => {
        console.log(err);
    });
});

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // console.log("DB_CONNECTION_SECRET:", process.env.DB_CONNECTION_SECRET); // Debug
        await mongoose.connect(process.env.DB_CONNECTION_SECRET);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
};

module.exports = connectDB;



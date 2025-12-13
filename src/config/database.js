
// const mongoose = require("mongoose");

// const connectDB = async () => {
//     try {
//         // console.log("Loaded Mongo URI:", process.env.MONGO_URI); // Debug
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected successfully");
//     } catch (err) {
//         console.error("Database connection failed:", err);
//     }
// };

// module.exports = connectDB;





const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.DB_CONNECTION_SECRET;
    console.log("Connecting to Mongo:", uri ? "LOADED" : "MISSING");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

module.exports = connectDB;

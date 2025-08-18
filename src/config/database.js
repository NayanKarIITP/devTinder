const mongoose = require("mongoose")

const connectDB = async () => {
    console.log(process.env.DB.CONNECTION_SECRET);
    await mongoose.connect(process.env.DB.CONNECTION_SECRET)
};

module.exports = connectDB;
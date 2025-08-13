const mongoose = require("mongoose")

const connectDB = async (params) => {
    await mongoose.connect("mongodb+srv://namastedev:xmvmD5rAjbxOMErV@namaste.94menwr.mongodb.net/NewnewTinder")
}

module.exports = connectDB;
const express = require('express');
const serverless = require("serverless-http");
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// ⭐ CORS MUST BE THE VERY FIRST MIDDLEWARE ⭐
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://techtribe-delta.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ⭐ FIX FOR PREFLIGHT (MUST BE AFTER app.use(cors)) ⭐
app.options(/.*/, cors());

app.use(express.json());
app.use(cookieParser());

// ⭐ ROUTES
app.use("/", require('./routes/auth'));
app.use("/", require('./routes/profile'));
app.use("/", require('./routes/request'));
app.use("/", require('./routes/user'));
app.use("/", require('./routes/chat'));

connectDB();

// ⭐ SERVERLESS / LOCAL DECISION
if (process.env.NETLIFY === "true") {
  module.exports.handler = serverless(app);
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("Server running:", PORT));
}

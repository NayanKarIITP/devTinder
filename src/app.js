// const express = require('express');
// const serverless = require("serverless-http");
// const app = express();
// const connectDB = require('./config/database');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// // ⭐ CORS MUST BE THE VERY FIRST MIDDLEWARE ⭐
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://techtribe-delta.vercel.app"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   })
// );

// // ⭐ FIX FOR PREFLIGHT (MUST BE AFTER app.use(cors)) ⭐
// app.options(/.*/, cors());

// app.use(express.json());
// app.use(cookieParser());

// // ⭐ ROUTES
// app.use("/", require('./routes/auth'));
// app.use("/", require('./routes/profile'));
// app.use("/", require('./routes/request'));
// app.use("/", require('./routes/user'));
// app.use("/", require('./routes/chat'));

// connectDB();

// // ⭐ SERVERLESS / LOCAL DECISION
// if (process.env.NETLIFY === "true") {
//   module.exports.handler = serverless(app);
// } else {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log("Server running:", PORT));
// }









const express = require('express');
const serverless = require("serverless-http");
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://techtribe-delta.vercel.app",
    ],
    credentials: true,
  })
);

// ⭐ FIX for Node 20 — REMOVE ALL app.options() calls
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/", require('./routes/auth'));
app.use("/", require('./routes/profile'));
app.use("/", require('./routes/request'));
app.use("/", require('./routes/user'));
app.use("/", require('./routes/chat'));

connectDB();

if (process.env.NETLIFY === "true") {
  module.exports.handler = serverless(app);
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("Server running:", PORT));
}

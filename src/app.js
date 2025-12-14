// const express = require('express');
// const serverless = require("serverless-http");
// const app = express();
// const connectDB = require('./config/database');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// app.use(cors({
//   origin: ["http://localhost:5173","https://techtribe-delta.vercel.app"],
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use("/", require('./routes/auth'));
// app.use("/", require('./routes/profile'));
// app.use("/", require('./routes/request'));
// app.use("/", require('./routes/user'));
// app.use("/", require('./routes/chat'));

// connectDB();

// // IMPORTANT!
// if (process.env.NETLIFY) {
//   module.exports.handler = serverless(app);
// } else {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log("Server running:", PORT));
// }





const express = require('express');
const http = require('http'); // ⚠️ ADD THIS
const serverless = require("serverless-http");
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initializeSocket = require('./utils/socket'); // ⚠️ ADD THIS
require('dotenv').config();

app.use(cors({
  origin: ["http://localhost:5173","https://techtribe-delta.vercel.app"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", require('./routes/auth'));
app.use("/", require('./routes/profile'));
app.use("/", require('./routes/request'));
app.use("/", require('./routes/user'));
app.use("/", require('./routes/chat'));

connectDB();

// IMPORTANT!
if (process.env.NETLIFY) {
  module.exports.handler = serverless(app);
} else {
  const PORT = process.env.PORT || 5000;
  
  // ⚠️ CREATE HTTP SERVER
  const server = http.createServer(app);
  
  // ⚠️ INITIALIZE SOCKET.IO
  initializeSocket(server);
  
  // ⚠️ START SERVER
  server.listen(PORT, () => {
    console.log("Server running:", PORT);
  });
}
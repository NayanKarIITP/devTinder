
const express = require("express");
const http = require("http");
const serverless = require("serverless-http");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeSocket = require("./utils/socket");
require("dotenv").config();

const app = express();

//  TRUST PROXY (IMPORTANT for secure cookies on Render)
app.set("trust proxy", 1);

// ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "https://techtribe-delta.vercel.app",
];

// CORS CONFIGURATION
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // VERY IMPORTANT for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/request"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/chat"));

// CONNECT DATABASE
connectDB();

// SERVER CONFIGURATION
if (process.env.NETLIFY) {
  // For serverless deployment (if ever needed)
  module.exports.handler = serverless(app);
} else {
  const PORT = process.env.PORT || 5000;

  const server = http.createServer(app);

  // Initialize Socket.io
  initializeSocket(server);

  server.listen(PORT, () => {
    console.log("Server running on port:", PORT);
  });
}

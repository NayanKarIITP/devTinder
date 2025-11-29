const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

// CORS FIX FOR RENDER + LOCAL
app.use(cors({
  origin: [ "http://localhost:5173", process.env.FRONTEND_URL ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const initializeSocket = require('./utils/socket');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;

// CONNECT DATABASE AND START SERVER
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

const express = require('express')
const app = express()
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http'); //<<

require('dotenv').config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json()); //This line is used in Express.js to allow your server to parse incoming JSON data in the body of HTTP requests.
app.use(cookieParser());  //You cannot access cookies via req.cookies, because by default, Express doesn't know how to parse them.that'why we use app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat'); //<<
const intializeSocket = require('./utils/socket');  //<<

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter); //<<

const server = http.createServer(app); //<<
intializeSocket(server);  //<<

//Connecting database with server
connectDB()
  .then(() => {
    console.log("Database connected succesfully");
    server.listen(process.env.PORT, () => {
      console.log("Server is running on port 5000")
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err)
  });



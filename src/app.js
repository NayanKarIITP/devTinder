const express = require('express')
const app = express()
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

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

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/", userRouter);

//Connecting database with server
connectDB()
  .then(() => {
    console.log("Database connected succesfully");
    app.listen(5000, () => {
      console.log("Server is running on port 5000")
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err)
  });



// const express = require('express');
// const authRouter =  express.Router();

// const { validateSignUpData } = require("../utils/validation");
// var bcrypt = require('bcrypt');
// const User = require("../models/user");

// authRouter.post('/sign', async (req, res) => {
//   try {
//     //validation
//     validateSignUpData(req);

//     //Encrypt the password
//     const {firstName,lastName,emailId,password,gender,age,about,skills,photoURL} = req.body;

//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const userData = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//       gender,
//       age,
//       about,
//       skills,
//       photoURL
//     });

//     const savedUser = await userData.save();

//     const token = await savedUser.getJWT(); 
//     res.cookie("token", token, { 
//       expires: new Date(Date.now() + 120 * 3600000) 
//     });

//     res.json({message:'User added successfully',data:savedUser});

//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(401).send("Error signing up user: ");
//   }
// })


// authRouter.post("/login", async (req, res) => {

//   try {
//     const { emailId, password } = req.body;

//     const user = await User.findOne({ emailId: emailId });
//     if (!user) {
//       throw new Error("Invalid data");
//     }
//     const isPasswordValid = await user.validatePassword(password); // See models/user.js

//     if (isPasswordValid) {
//       //Create a JWT token
//       const token = await user.getJWT(); // See models/user.js

//       //Add  the token to cookie and send the response back to the user
//       res.cookie("token", token, {   //{httpOnly:true} ->it will work for http only not for https or others
//         expires: new Date(Date.now() + 120 * 3600000) //the cookies will expires in 8 hrs
//       });

//       res.send(user);
//     } else {
//       throw new Error("Invalid Credentials")
//     }
//   } catch (error) {
//     res.status(401).send("ERROR: " + error.message);
//   }
// });


// authRouter.post("/logout", async (req, res) => {
//   res.cookie("token", null, {   
//         expires: new Date(Date.now())
//       });
//     res.send("Log out successfully");
// })


// module.exports = authRouter;





const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
var bcrypt = require('bcrypt');
const User = require("../models/user");

// ======================= SIGNUP ==========================
authRouter.post('/sign', async (req, res) => {
  try {
    // OPTIONAL validation (temporarily)
    // validateSignUpData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      about,
      skills,
      photoURL
    } = req.body;

    if(!firstName || !lastName || !emailId || !password){
      return res.status(400).json({
        error: "Required fields missing"
      });
    }

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const userData = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      about,
      skills,
      photoURL
    });

    const savedUser = await userData.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 120 * 3600000)
    });

    return res.json({
      message: 'User added successfully',
      data: savedUser
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(401).json({ error: error.message });
  }
});


// ======================= LOGIN ==========================
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if(!emailId || !password){
      return res.status(400).json({ error: "Email & Password required" });
    }

    const user = await User.findOne({ emailId });

    if (!user) return res.status(401).json({ error: "Email not found" });

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 120 * 3600000)
    });

    return res.send(user);

  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({ error: error.message });
  }
});


// ======================= LOGOUT ==========================
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  return res.send("Logout successful");
});


module.exports = authRouter;

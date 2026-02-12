const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
var bcrypt = require('bcrypt');
const User = require("../models/user");

authRouter.post('/sign', async (req, res) => {
  try {
    //validation
    validateSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password, gender, age, about, skills, photoURL } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

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

    // res.cookie("token", token, { 
    //   expires: new Date(Date.now() + 120 * 3600000) 
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // REQUIRED for Vercel + Render
      sameSite: "none",    // REQUIRED for cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({ message: 'User added successfully', data: savedUser });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(401).send("Error signing up user: ");
  }
})


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid data");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send(user);
  } catch (error) {
    res.status(401).send("ERROR: " + error.message);
  }
});



authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  expires: new Date(0),
});
  res.send("Log out successfully");
})


module.exports = authRouter;




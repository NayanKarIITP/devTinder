// const express = require('express');
// const profileRouter = express.Router();

// const { userAuth } = require("../middlewares/auth");
// const { validateEditProfileData } = require('../utils/validation');

// profileRouter.get("/profile/view", userAuth, async (req, res) => {

//   try {

//     //Validate my token

//     const user = req.user; //If you did not understand see middlewares/auth.js

//     if (!user) {
//       throw new Error("No user found");
//     }

//     res.send(user);
//   } catch (error) {
//     res.status(401).send("Somtething wrong: ")
//   }
// })

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

//   try {
//     if (!validateEditProfileData(req)) {
//       throw new Error("Inavalid Edit Request")
//     }

//     const loggedInuser = req.user;

//     Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));

//     await loggedInuser.save();

//     res.json({
//       message: `${loggedInuser.firstName}, your profile updated succesfully`,
//       data: loggedInuser,
//     });
//   } catch (error) {
//     res.status(400).send("ERROR: " + error.message);
//   }

// })

// module.exports = profileRouter;




const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/validation');
const upload = require('../middlewares/upload'); // <-- Import the new middleware

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; 

    if (!user) {
      throw new Error("No user found");
    }

    res.send(user);
  } catch (error) {
    res.status(401).send("Something went wrong: " + error.message);
  }
})

// <-- Inject upload.single('photo') before your async controller
profileRouter.patch("/profile/edit", userAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInuser = req.user;

    // NEW: If Multer successfully uploaded a file, Cloudinary attaches the live URL to req.file.path
    // We append this to req.body so your Object.keys loop saves it automatically!
    if (req.file) {
      req.body.photoURL = req.file.path;
    }

    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));

    await loggedInuser.save();

    res.json({
      message: `${loggedInuser.firstName}, your profile updated successfully!`,
      data: loggedInuser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
})

module.exports = profileRouter;
const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        //Read the token from the req.cookies 
        const { token } = req.cookies;

        if(!token){
            return res.status(401).send("Please Login First");
        }
        //Validate the token
        const decodeObj = jwt.verify(token, process.env.JWT_SECRET);

        //Find the username
        const { _id } = decodeObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(error.message.includes("Unauthorized") ? 401 : 400).send("ERROR: " + error.message);
    }
};

module.exports = {
    userAuth
}




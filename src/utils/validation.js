
const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is required");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a stronger password");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "photoURL",
        "gender",
        "age",
        "about",
        "skills"
    ];

    // 1. Check if the user is trying to inject fields that aren't allowed
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    if (!isEditAllowed) {
        return false;
    }

    // 2. FormData Sanitization: Handle empty string conversions
    if (req.body.age === "") {
        delete req.body.age;
    }

    // 3. Extra Security: Prevent crazy long strings that could bloat your DB
    if (req.body.firstName && req.body.firstName.length > 50) {
        throw new Error("First name is too long");
    }
    if (req.body.about && req.body.about.length > 500) {
        throw new Error("About section cannot exceed 500 characters");
    }

    return true; 
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
};
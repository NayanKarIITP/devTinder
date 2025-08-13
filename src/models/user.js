const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `Email is not valid: ${props.value}`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                });
            },
            message: props => `Password is not strong enough: ${props.value}`
        }
    },
    gender: {
        type: String,
        validate(value) {
            if (!["Male", "Female", "other"].includes(value)) {
                throw new Error("Gender is not defined");
            }
        }
    },
    age: {
        type: Number
    },
    about: {
        type: String,
        default: "No informatin needed"
    },
    skills: {
        type: [String],
    },
    photoURL: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPobl062nJXumgIJIzjRG0898jXyf2QEnAlFLyi-Y2609tuvvyLcd1rTVo3uod9sdgsQ&usqp=CAU",
        validate: {
            validator: function (value) {
                return validator.isURL(value);
            },
            message: props => `URL is not valid: ${props.value}`
        }
    }
},
    {
        timestamps: true,
    },
);

userSchema.methods.getJWT = async function () {  //in this case arrow function will not work
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@tinder890", {
        expiresIn: "7d",
    }); //token will be expire in 7 day

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
};

module.exports = mongoose.model('User', userSchema);

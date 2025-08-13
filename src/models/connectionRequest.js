const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", // referrence to the user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status: {
        type: String,
        enum: {  //Enums are used to define a set of named constants.
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is not a valid status`,
        }
    }
},{
    timestamps: true
});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;

    //Check if the fromUserId and toUserId are the same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send a connection request to yourself");
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
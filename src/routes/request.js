const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  const user = req.user;
  try {
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allwoedStatus = ["ignore", "interested"];

    if (!allwoedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status " + status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    //If there is an existing ConnectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })

    const data = await connectionRequest.save();

    res.json({
      message: req.user.firstName + " is " + status + " to " + toUser.firstName,
      data,
    });
  } catch (error) {
    res.status(400).send("Error fetching: " + error.message);
  }
});


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allwoedStatus = ["accepted", "rejected"];

    if (!allwoedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status " + status });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if(!connectionRequest){
      return res.status(400).json({ message: "Connection request not found" });
    }
    
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: "Connection request is " + status,
      data,
    });
  } catch (error) {
    res.status(400).send("Error fetching: " + error.message);
  }

  //Valid Id or not
  //Akshay=>Nayan
  //loggdIniD = toUserId 
  //requestId should be valid

})
module.exports = requestRouter;

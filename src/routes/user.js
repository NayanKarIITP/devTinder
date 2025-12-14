const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = ["_id","firstName", "lastName", "age", "gender", "photoURL", "skills", "about"];

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => { //mane jara friend request pathiyehe tader data
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoURL", "skills", "about"]);

        res.json({
            message: "Data fetched Successfully ",
            data: connectionRequests,
        });

    } catch (error) {
        res.status(400).send("Error fetching: " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            else return row.fromUserId;
        });

        res.json({
            message: "See all your accepted connections ",
            data,
        });
    } catch (error) {
        res.status(400).send("Error fetching: " + error.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {

    //User should see all the user cards except->
    //1.his own cards(loggedIn user)
    //2.his connections
    //3.ignored/interested cards
    //4.already sent the connection request

    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');

        const hiddenUsersFromFeed = new Set();

        connectionRequests.forEach(({ fromUserId, toUserId }) => {
            hiddenUsersFromFeed.add(fromUserId.toString());
            hiddenUsersFromFeed.add(toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
                { _id: { $ne: loggedInUser } },
            ],
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.send(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = userRouter;
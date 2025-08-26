const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { Chat } = require('../models/chat');

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId",userAuth, async (req, res) => {
    const {targetUserId} = req.params;

    const userId = req.user._id; //userId is stored in req.user after authentication
  try {
    let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] } 
    }).populate({
      path:"messages.senderId",
      select:"firstName lastName"
    });

    if(!chat) {
        chat = new Chat({
            participants: [userId, targetUserId],
            messages: []
        });
    }

    // You can send a response or continue your logic here
    res.status(200).json({ chat });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = chatRouter;

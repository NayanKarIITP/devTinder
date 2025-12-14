const { Server } = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");


// Generate unique room id
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://techtribe-delta.vercel.app",
      credentials: true,
    },
  });

  io.on("connection", (clientSocket) => {
    console.log("User connected:", clientSocket.id);

    // Join chat
    clientSocket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} joined room: ${roomId}`);
      clientSocket.join(roomId);
    });

    // Send message
    clientSocket.on("sendMessage", async ({ firstName,lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
          timestamp: new Date(),
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", { firstName,lastName, text });
        console.log(`${firstName} sent: ${text}`);

      } catch (error) {
        console.error(" Error saving message:", error);
      }
    });

    // Disconnect
    clientSocket.on("disconnect", () => {
      console.log(" User disconnected:", clientSocket.id);
    });
  });
};

module.exports = initializeSocket;

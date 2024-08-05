require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cannedResponse = require("./routes/cannedResponse");
const messages = require("./routes/messages");
const beforeStartingConversation = require("./routes/beforeStartingConversation");
const delayInResponse = require("./routes/delayInResponse");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  const connectionTime = Date.now();

  socket.on("pageVisit", async ({ userId, visitDetail }) => {
    try {
      const user = await User.findById(userId);
      if (user.blocked==="true") {
        console.log(`User ${userId} is blocked. Disconnecting.`);
        return;
      }
      if (user) {
        user.visitHistory.push(visitDetail);
        user.currentReferrer = visitDetail.referrer;
        await user.save();

        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { currentPath: visitDetail.path },
          { new: true }
        );

        io.emit("userInfo", updatedUser);
        io.emit("userInfo", user);
      } else {
        console.error(`User with ID ${userId} not found`);
      }
    } catch (error) {
      console.error("Error updating visit history:", error);
    }
  });

  socket.on("join", async ({ room, userId }) => {
    try {
      const user = await User.findById(userId);

      // Check if user is blocked
      if (user.blocked==="true") {
        console.log(`User ${userId} is blocked. Disconnecting.`);
        return;
      }
      socket.join(room);
      console.log(`${userId} joined room ${room}`);
      socket.userId = userId;

      if (userId) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { status: "status-online"},
          { new: true }
        );
        console.log("Updated user to status-online:", updatedUser);
        io.emit("userInfo", updatedUser);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });

  socket.on("message", (message) => {
    io.to(message.room).emit("message", message);
    console.log("Message sent:", message);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected");

    if (socket.userId) {
      try {
        const disconnectTime = Date.now();
        const onlineDuration = disconnectTime - connectionTime;
        const user = await User.findById(socket.userId);

        if (user) {
          if (user.blocked==="true") {
            console.log(`User ${socket.userId} is blocked. Not updating status.`);
            return;
          }
          user.onlineDurations.push({
            path: user.currentPath,
            visitDate: connectionTime,
            duration: onlineDuration,
            referrer: user.currentReferrer,
          });

          user.status = "status-offline";
          user.lastDisconnect = disconnectTime;

          await user.save();

          console.log("Updated user to status-offline:", user);
          io.emit("userInfo", user);
        } else {
          console.error(`User with ID ${socket.userId} not found`);
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/messages", messages);
app.use("/", cannedResponse);
app.use("/beforeStartingConversation",beforeStartingConversation);
app.use("/delayInResponse", delayInResponse);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "onlineChat",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

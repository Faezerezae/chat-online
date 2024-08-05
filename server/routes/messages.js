const express = require("express");
const router = express.Router();
const MessageSchema = require("../models/Message");

router.post("/", async (req, res) => {
    try {
      const { userId, username, message, room, sender, status } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({ message: "Message cannot be empty" });
      }
  
      const newMessage = new MessageSchema({
        userId,
        username,
        message,
        room,
        sender,
        status
      });
      await newMessage.save();
  
      req.io.emit("newMessage", newMessage);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error, unable to send message" });
    }
  });
  
  router.get("/:userId", async (req, res) => {
    try {
      const messages = await MessageSchema.find({ userId: req.params.userId });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await MessageSchema.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    console.error("Error retrieving message:", error);
    res.status(500).json({ message: "Internal Server Error, unable to retrieve message" });
  }
});



  router.patch("/:messageId", async (req, res) => {
    try {
      const { message } = req.body;
      const { messageId } = req.params;
  
      if (!message || message.trim() === "") {
        return res.status(400).json({ message: "Message cannot be empty" });
      }
  
      const updatedMessage = await MessageSchema.findByIdAndUpdate(
        messageId,
        { message },
        { new: true }
      );
  
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
        req.io.emit("messageUpdated", updatedMessage);
      res.status(200).json(updatedMessage);
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await MessageSchema.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    req.io.emit("messageDeleted", messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: error.message });
  }
});

  module.exports = router;
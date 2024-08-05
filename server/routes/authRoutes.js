const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Avatars = require("@dicebear/avatars").default;
const style = require("@dicebear/avatars-avataaars-sprites").default;

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    let avatar = "";

    if (role === "User") {
      const avatars = new Avatars(style);
      avatar = avatars.create();
    }

    const newUser = new User({ username, password, role, avatar });
    await newUser.save();
    res
      .status(201)
      .json({ message: "Registration successful!", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create-sequential-user", async (req, res) => {
  try {
    let newUsername = "";
    let attemptCount = 0;

    do {
      attemptCount++;
      newUsername = `user${attemptCount}`;
      const existingUser = await User.findOne({ username: newUsername });
      if (!existingUser) {
        break;
      }
    } while (attemptCount < 100);

    if (attemptCount >= 100) {
      return res
        .status(500)
        .json({ message: "Failed to generate a unique username" });
    }

    const avatars = new Avatars(style);
    const avatar = avatars.create();

    const newUser = new User({
      username: newUsername,
      password: "password", 
      role: "User",
      avatar: avatar,
      status: "status-online",
      ip: req.body.ip,
      location: req.body.location,
      os: req.body.os,
      browser: req.body.browser,
      device: req.body.device,
      cpu: req.body.cpu,
      currentPath: req.body.currentPath,
      currentTitle: req.body.currentTitle,
      visitHistory: req.body.visitHistory,
      currentReferrer: req.body.currentReferrer,
    });

    await newUser.save();
    req.io.emit("newUser", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
});

router.patch("/block-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blocked = true;
    await user.save();
    req.io.emit("userBlocked", userId);
    res.status(200).json({ message: "User blocked successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const { role, blocked } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (blocked !== undefined) filter.blocked = blocked === "true";
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const CategoryCannedResponse = require("../models/CategoryCannedResponse");
const CannedResponse = require("../models/CannedResponse");

router.post("/categoriesCannedResponses", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .send({ message: "CategoryCannedResponse name is required" });
  }

  try {
    const newCategoryCannedResponse = new CategoryCannedResponse({ name });
    await newCategoryCannedResponse.save();
    res.status(201).send({
      message: "CategoryCannedResponse added successfully",
      categoryCannedResponse: newCategoryCannedResponse,
    });
  } catch (error) {
    res.status(400).send({
      message:
        "CategoryCannedResponse already exists or error adding categoryCannedResponse",
    });
  }
});

// Get all categoriesCannedResponses
router.get("/categoriesCannedResponses", async (req, res) => {
  const categoriesCannedResponses = await CategoryCannedResponse.find();
  res.send(categoriesCannedResponses);
});

// Add a new cannedResponse to a specific categoryCannedResponse
router.post("/responses", async (req, res) => {
  const { categoryName, cannedResponse } = req.body;

  if (!categoryName || !cannedResponse) {
    return res.status(400).send({
      message: "CategoryCannedResponse name and cannedResponse are required",
    });
  }

  try {
    let categoryCannedResponse = await CategoryCannedResponse.findOne({
      name: categoryName,
    });
    if (!categoryCannedResponse) {
      // If categoryCannedResponse does not exist, create a new one
      categoryCannedResponse = new CategoryCannedResponse({
        name: categoryName,
      });
      await categoryCannedResponse.save();
    }

    const newResponse = new CannedResponse({
      categoryCannedResponse: categoryCannedResponse._id,
      cannedResponse,
    });
    await newResponse.save();

    res.status(201).send({ message: "CannedResponse added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error adding CannedResponse" });
  }
});

// Get all cannedResponses
router.get("/cannedResponses", async (req, res) => {
  const allResponses = await CannedResponse.find().populate(
    "categoryCannedResponse"
  );
  res.send(allResponses);
});

// Get cannedResponses of a specific categoryCannedResponse
router.get("/cannedResponses/:categoryCannedResponseName", async (req, res) => {
  const categoryCannedResponseName = req.params.categoryCannedResponseName;

  const categoryCannedResponse = await CategoryCannedResponse.findOne({
    name: categoryCannedResponseName,
  });
  if (!categoryCannedResponse) {
    return res
      .status(404)
      .send({ message: "CategoryCannedResponse not found" });
  }

  const categoryCannedResponseResponses = await CannedResponse.find({
    categoryCannedResponse: categoryCannedResponse._id,
  }).populate("categoryCannedResponse");
  res.send(categoryCannedResponseResponses);
});


module.exports = router;
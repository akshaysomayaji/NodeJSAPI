const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  const controller = require("../controllers/contact.controller")(db);

  // Send a new contact request
  router.post("/", controller.sendRequest);

  // Get all requests
  router.get("/", controller.getAllRequests);

  // Get request by ID
  router.get("/:id", controller.getRequestById);

  // Update request
  router.put("/:id", controller.updateRequest);

  // Delete request
  router.delete("/:id", controller.deleteRequest);

  // Get support info (Quick Response, Expert Support, Secure)
  router.get("/info/features", controller.getSupportFeatures);

  return router;
};
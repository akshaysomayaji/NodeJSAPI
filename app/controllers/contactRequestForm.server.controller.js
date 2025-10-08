module.exports = (db) => {
  const { ContactRequest, SupportFeature } = db;

  return {
    // POST /api/contact - Send Request
    sendRequest: async (req, res) => {
      try {
        const { categoryName, contactInfo, description } = req.body;
        if (!categoryName || !contactInfo) {
          return res.status(400).json({ message: "Category and contact info required." });
        }

        const newReq = await ContactRequest.create({
          categoryName,
          contactInfo,
          description,
          status: "New",
        });

        return res.status(201).json({
          message: "Request sent successfully!",
          request: newReq,
        });
      } catch (err) {
        console.error("sendRequest error:", err);
        return res.status(500).json({ message: "Server error sending request." });
      }
    },

    // GET /api/contact - List all contact requests
    getAllRequests: async (req, res) => {
      try {
        const requests = await ContactRequest.findAll({
          order: [["createdAt", "DESC"]],
        });
        res.json(requests);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching requests." });
      }
    },

    // GET /api/contact/:id - Get single request
    getRequestById: async (req, res) => {
      try {
        const reqData = await ContactRequest.findByPk(req.params.id);
        if (!reqData) return res.status(404).json({ message: "Request not found." });
        res.json(reqData);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching request." });
      }
    },

    // PUT /api/contact/:id - Update response/status
    updateRequest: async (req, res) => {
      try {
        const { status, responseMessage } = req.body;
        const reqData = await ContactRequest.findByPk(req.params.id);
        if (!reqData) return res.status(404).json({ message: "Request not found." });

        if (status) reqData.status = status;
        if (responseMessage) reqData.responseMessage = responseMessage;
        await reqData.save();

        res.json({ message: "Request updated successfully.", request: reqData });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating request." });
      }
    },

    // DELETE /api/contact/:id - Delete request
    deleteRequest: async (req, res) => {
      try {
        const reqData = await ContactRequest.findByPk(req.params.id);
        if (!reqData) return res.status(404).json({ message: "Request not found." });

        await reqData.destroy();
        res.json({ message: "Request deleted successfully." });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting request." });
      }
    },

    // GET /api/support - Return the 3 info icons/labels
    getSupportFeatures: async (req, res) => {
      try {
        await SupportFeature.seedDefaults();
        const features = await SupportFeature.findAll();
        res.json(features);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching support features." });
      }
    },
  };
};
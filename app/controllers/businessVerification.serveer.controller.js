const path = require("path");
const fs = require("fs");
const db = require("../models");
const Business = db.businessVerification;

// multer setup for file uploads
const multer = require("multer");

// create uploads directory if not exists
const uploadDir = path.join(__dirname, "..", "uploads", "verifications");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// storage config: keep original name + timestamp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, ${name}_${Date.now()}${ext});
  }
});

// file filter allow PDF, JPG, PNG
const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only PDF, JPG, JPEG or PNG are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// exported middleware for routes to accept two fields
exports.uploadMiddleware = upload.fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "panCard", maxCount: 1 }
]);

// Create a new verification entry (files optional)
exports.createVerification = async (req, res) => {
  try {
    const { gstNumber, panNumber, businessName } = req.body;

    // Basic required validation
    if (!businessName) return res.status(400).json({ message: "Business name is required" });

    // optional: simple GST/PAN pattern checks (lightweight; adjust as needed)
    if (gstNumber && gstNumber.length !== 15) {
      return res.status(400).json({ message: "GST number must be 15 characters" });
    }
    if (panNumber && panNumber.length !== 10) {
      return res.status(400).json({ message: "PAN number must be 10 characters" });
    }

    const payload = { gstNumber, panNumber, businessName };

    // attach file paths if uploaded
    if (req.files) {
      if (req.files.gstCertificate && req.files.gstCertificate[0]) {
        payload.gstCertificateUrl = path.join("uploads", "verifications", req.files.gstCertificate[0].filename);
      }
      if (req.files.panCard && req.files.panCard[0]) {
        payload.panCardUrl = path.join("uploads", "verifications", req.files.panCard[0].filename);
      }
    }

    const created = await Business.create(payload);
    return res.status(201).json({ message: "Verification submitted", data: created });
  } catch (err) {
    console.error("createVerification:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get verification by id
exports.getVerification = async (req, res) => {
  try {
    const entry = await Business.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    return res.json(entry);
  } catch (err) {
    console.error("getVerification:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Admin: list all verifications with optional status filter
exports.listVerifications = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.verificationStatus = status;
    const rows = await Business.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.json(rows);
  } catch (err) {
    console.error("listVerifications:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Admin: update verification status / notes
exports.updateVerification = async (req, res) => {
  try {
    const entry = await Business.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });

    const { verificationStatus, adminNotes } = req.body;
    if (verificationStatus) entry.verificationStatus = verificationStatus;
    if (adminNotes !== undefined) entry.adminNotes = adminNotes;

    await entry.save();
    return res.json({ message: "Updated", data: entry });
  } catch (err) {
    console.error("updateVerification:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Optional: allow user to re-upload documents (files only)
exports.replaceDocuments = async (req, res) => {
  try {
    const entry = await Business.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });

    // files processed by uploadMiddleware
    if (req.files) {
      if (req.files.gstCertificate && req.files.gstCertificate[0]) {
        // remove old file if exists
        if (entry.gstCertificateUrl) {
          const oldPath = path.join(__dirname, "..", entry.gstCertificateUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        entry.gstCertificateUrl = path.join("uploads", "verifications", req.files.gstCertificate[0].filename);
      }
      if (req.files.panCard && req.files.panCard[0]) {
        if (entry.panCardUrl) {
          const oldPath = path.join(__dirname, "..", entry.panCardUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        entry.panCardUrl = path.join("uploads", "verifications", req.files.panCard[0].filename);
      }
    }

    await entry.save();
    return res.json({ message: "Documents updated", data: entry });
  } catch (err) {
    console.error("replaceDocuments:", err);
    return res.status(500).json({ message: err.message });
  }
};
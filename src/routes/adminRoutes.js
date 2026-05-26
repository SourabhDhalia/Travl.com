const express = require("express");
const adminController = require("../controllers/adminController");
const asyncHandler = require("../utils/asyncHandler");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/admin", requireAdmin, asyncHandler(adminController.renderDashboard));
router.get("/admin/destinations/new", requireAdmin, asyncHandler(adminController.renderEditPage));
router.post("/admin/destinations/new", requireAdmin, asyncHandler(adminController.saveDestination));
router.get("/admin/destinations/:id/edit", requireAdmin, asyncHandler(adminController.renderEditPage));
router.post("/admin/destinations/:id/edit", requireAdmin, asyncHandler(adminController.saveDestination));
router.post("/admin/destinations/:id/delete", requireAdmin, asyncHandler(adminController.deleteDestination));
router.post("/admin/submissions/:id/delete", requireAdmin, asyncHandler(adminController.deleteSubmission));

router.get("/admin/approval", requireAdmin, asyncHandler(adminController.renderApprovalPage));
router.post("/admin/approval/:id/approve", requireAdmin, asyncHandler(adminController.approveAdmin));
router.post("/admin/approval/:id/reject", requireAdmin, asyncHandler(adminController.rejectAdmin));

module.exports = router;

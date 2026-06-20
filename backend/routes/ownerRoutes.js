const express = require("express");

const router = express.Router();

const { getOwnerDashboard } = require("../controllers/ownerController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/owner/dashboard",
    verifyToken,
    roleMiddleware("store_owner"),
    getOwnerDashboard
);

module.exports = router;
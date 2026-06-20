const express = require("express");

const router = express.Router();

const {
    submitRating,
    updateRating
} = require("../controllers/ratingController");

const verifyToken = require("../middleware/authMiddleware");

router.post(
    "/ratings",
    verifyToken,
    submitRating
);

router.put(
    "/ratings/:storeId",
    verifyToken,
    updateRating
);

module.exports = router;
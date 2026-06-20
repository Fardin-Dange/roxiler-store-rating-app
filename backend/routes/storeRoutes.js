const {
    createStore,
    getAllStores
} = require("../controllers/storeController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const express = require("express");


const router = express.Router();


router.post(
    "/stores",
    verifyToken,
    roleMiddleware("admin"),
    createStore
);

router.get(
    "/stores",
    verifyToken,
    getAllStores
);

module.exports = router;
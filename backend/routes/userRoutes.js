const bcrypt = require("bcryptjs");
const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const {
    validateSignup
} = require("../middleware/validationMiddleware");

const {
    getUsers,
    createUser,
    loginUser,
    updatePassword,
    logout
} = require("../controllers/userController");

router.put(
    "/change-password",
    verifyToken,
    updatePassword
);

router.post("/login", loginUser);

router.get("/users", getUsers);

router.post("/signup", validateSignup,createUser);

router.post(
    "/logout",
    verifyToken,
    logout
);

module.exports = router;
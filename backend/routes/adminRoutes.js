const express = require("express");

const router = express.Router();

const {
    createAdminUser,
    getDashboardStats,
    getAllUsers,
    getAllStores,
    getUserById,
    getStoreById,
    deleteUser,
    deleteStore
} = require("../controllers/adminController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/admin/dashboard",
    verifyToken,
    roleMiddleware("admin"),
    getDashboardStats
);

router.get(
    "/admin/users",
    verifyToken,
    roleMiddleware("admin"),
    getAllUsers
);

router.post(
    "/admin/users",
    verifyToken,
    roleMiddleware("admin"),
    createAdminUser
);

router.get(
    "/admin/stores",
    verifyToken,
    roleMiddleware("admin"),
    getAllStores
);

router.get(
    "/admin/stores/:id",
    verifyToken,
    roleMiddleware("admin"),
    getStoreById
);

router.get(
    "/admin/users/:id",
    verifyToken,
    roleMiddleware("admin"),
    getUserById
);

router.delete(
    "/admin/users/:id",
    verifyToken,
    roleMiddleware("admin"),
    deleteUser
);

router.delete(
    "/admin/stores/:id",
    verifyToken,
    roleMiddleware("admin"),
    deleteStore
);

module.exports = router;

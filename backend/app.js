const ratingRoutes = require("./routes/ratingRoutes");

const cors = require("cors");

const ownerRoutes = require("./routes/ownerRoutes");

const storeRoutes = require("./routes/storeRoutes");

const adminRoutes = require("./routes/adminRoutes");

const roleMiddleware = require("./middleware/roleMiddleware");

const express = require("express");

const verifyToken = require("./middleware/authMiddleware");

const app = express();
app.use(cors());

const userRoutes = require("./routes/userRoutes");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Fardin!");
});

app.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Protected Route Accessed",
        user: req.user
    });

});

app.get(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);



app.use(userRoutes);
app.use(storeRoutes);
app.use(adminRoutes);
app.use(ratingRoutes);
app.use('/owner', ownerRoutes);

module.exports = app;
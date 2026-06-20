const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const getUsers = (req, res) => {

    db.query("SELECT * FROM users", (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(result);
    });

};

const createUser = async (req, res) => {

    const { name, email, password, address } = req.body;

    const role = "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
        "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)";

    db.query(
        sql,
        [name, email, hashedPassword, address, role],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "User Created Successfully"
            });
        }
    );
};

const updatePassword = async (req, res) => {

    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: "Current password and new password are required"
        });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message: "New password must be 8-16 characters, include one uppercase letter and one special character"
        });
    }

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            db.query(
                "UPDATE users SET password=? WHERE id=?",
                [hashedPassword, userId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    res.json({
                        message: "Password updated successfully"
                    });

                }
            );

        }
    );

};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });


        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    });

};

const logout = (req, res) => {

    res.json({
        message: "Logout Successful"
    });

};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    updatePassword,
    logout
};

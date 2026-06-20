const db = require("../config/db");
const bcrypt = require("bcryptjs");

const createAdminUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedAddress = typeof address === "string" ? address.trim() : "";
    const allowedRoles = ["user", "admin", "store_owner"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (normalizedName.length < 3 || normalizedName.length > 60) {
        return res.status(400).json({ message: "Name must be between 3 and 60 characters" });
    }

    if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid Email Format" });
    }

    if (!normalizedAddress || normalizedAddress.length > 400) {
        return res.status(400).json({ message: "Address is required and cannot exceed 400 characters" });
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 16) {
        return res.status(400).json({ message: "Password must be between 8 and 16 characters" });
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Role must be user, admin, or store_owner" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)",
            [normalizedName, normalizedEmail, hashedPassword, normalizedAddress, role],
            (error, result) => {
                if (error) {
                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({ message: "A user with this email already exists" });
                    }

                    return res.status(500).json({ message: error.message });
                }

                res.status(201).json({
                    message: "User Created Successfully",
                    userId: result.insertId
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) as totalUsers FROM users",
        (err, usersResult) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            stats.totalUsers =
                usersResult[0].totalUsers;

            db.query(
                "SELECT COUNT(*) as totalStores FROM store",
                (err, storesResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    stats.totalStores =
                        storesResult[0].totalStores;

                    db.query(
                        "SELECT COUNT(*) as totalRatings FROM rating",
                        (err, ratingsResult) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            stats.totalRatings =
                                ratingsResult[0].totalRatings;

                            res.json(stats);

                        }
                    );

                }
            );

        }
    );

};

const getAllUsers = (req, res) => {

    const search = req.query.search || "";

    const sort = req.query.sort || "name";

    const order =
        req.query.order === "desc"
            ? "DESC"
            : "ASC";

    const allowedSortFields = [
        "id",
        "name",
        "email",
        "address",
        "role"
    ];

    const sortField =
        allowedSortFields.includes(sort)
            ? sort
            : "name";

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE
            name LIKE ?
            OR email LIKE ?
            OR address LIKE ?
            OR role LIKE ?
        ORDER BY ${sortField} ${order}
    `;

    const searchValue = "%" + search + "%";

    db.query(
        sql,
        [
            searchValue,
            searchValue,
            searchValue,
            searchValue
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(result);

        }
    );

};

const getAllStores = (req, res) => {

    const userId = req.user.id;

    const search = req.query.search || "";

    const sort = req.query.sort || "name";

    const order =
        req.query.order === "desc"
            ? "DESC"
            : "ASC";

    const allowedSortFields = [
        "id",
        "name",
        "address"
    ];

    const sortField =
        allowedSortFields.includes(sort)
            ? sort
            : "name";

    const sql = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,

            IFNULL(
                ROUND(AVG(r.ratings),1),
                0
            ) AS overall_rating,

            IFNULL(
                (
                    SELECT ratings
                    FROM rating
                    WHERE user_id = ?
                    AND store_id = s.id
                ),
                0
            ) AS user_rating

        FROM store s

        LEFT JOIN rating r
        ON s.id = r.store_id

        WHERE
            s.name LIKE ?
            OR s.address LIKE ?

        GROUP BY s.id

        ORDER BY s.${sortField} ${order}
    `;

    const searchValue = `%${search}%`;

    db.query(
        sql,
        [userId, searchValue, searchValue],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(result);

        }
    );

};

const getUserById = (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, result) => {

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

        // Store Owner Special Case
        if (user.role === "store_owner") {

            const ratingSql = `
                SELECT
                    ROUND(AVG(r.ratings),1) AS storeRating
                FROM store s
                LEFT JOIN rating r
                ON s.id = r.store_id
                WHERE s.owner_id = ?
            `;

            db.query(
                ratingSql,
                [user.id],
                (err, ratingResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    user.storeRating =
                        ratingResult[0].storeRating || 0;

                    res.json(user);

                }
            );

        } else {

            res.json(user);

        }

    });

};

const getStoreById = (req, res) => {

    const storeId = Number(req.params.id);

    if (!Number.isInteger(storeId) || storeId <= 0) {
        return res.status(400).json({ message: "Invalid Store ID" });
    }

    const sql = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            IFNULL(ROUND(AVG(r.ratings),1), 0) AS rating,
            s.owner_id,
            u.name AS owner_name,
            u.email AS owner_email
        FROM store s
        LEFT JOIN rating r
            ON s.id = r.store_id
        LEFT JOIN users u
            ON s.owner_id = u.id
        WHERE s.id = ?
        GROUP BY s.id
    `;

    db.query(sql, [storeId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Store Not Found" });
        }

        const row = result[0];

        const store = {
            id: row.id,
            name: row.name,
            email: row.email,
            address: row.address,
            rating: Number(row.rating).toFixed(1),
            owner_id: row.owner_id
        };

        if (row.owner_name && row.owner_email) {
            store.owner = {
                id: row.owner_id,
                name: row.owner_name,
                email: row.owner_email
            };
        }

        res.json(store);
    });
};

const deleteUser = (req, res) => {

    const userId = Number(req.params.id);
    const adminId = Number(req.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
            message: "Invalid User ID"
        });
    }

    if (userId === adminId) {
        return res.status(400).json({
            message: "You cannot delete your own account"
        });
    }

    db.beginTransaction((transactionError) => {

        if (transactionError) {
            return res.status(500).json({
                message: transactionError.message
            });
        }

        const rollback = (error) => {
            db.rollback(() => {
                res.status(500).json({
                    message: error.message
                });
            });
        };

        db.query(
            "SELECT id FROM users WHERE id = ?",
            [userId],
            (findError, users) => {

                if (findError) {
                    return rollback(findError);
                }

                if (users.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({
                            message: "User Not Found"
                        });
                    });
                }

                const deleteRatingsSql = `
                    DELETE FROM rating
                    WHERE user_id = ?
                    OR store_id IN (
                        SELECT id
                        FROM store
                        WHERE owner_id = ?
                    )
                `;

                db.query(
                    deleteRatingsSql,
                    [userId, userId],
                    (ratingsError) => {

                        if (ratingsError) {
                            return rollback(ratingsError);
                        }

                        db.query(
                            "DELETE FROM store WHERE owner_id = ?",
                            [userId],
                            (storesError) => {

                                if (storesError) {
                                    return rollback(storesError);
                                }

                                db.query(
                                    "DELETE FROM users WHERE id = ?",
                                    [userId],
                                    (userError) => {

                                        if (userError) {
                                            return rollback(userError);
                                        }

                                        db.commit((commitError) => {

                                            if (commitError) {
                                                return rollback(commitError);
                                            }

                                            res.json({
                                                message: "User Deleted Successfully"
                                            });
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
};

const deleteStore = (req, res) => {

    const storeId = Number(req.params.id);

    if (!Number.isInteger(storeId) || storeId <= 0) {
        return res.status(400).json({
            message: "Invalid Store ID"
        });
    }

    db.beginTransaction((transactionError) => {

        if (transactionError) {
            return res.status(500).json({
                message: transactionError.message
            });
        }

        const rollback = (error) => {
            db.rollback(() => {
                res.status(500).json({
                    message: error.message
                });
            });
        };

        db.query(
            "SELECT id FROM store WHERE id = ?",
            [storeId],
            (findError, stores) => {

                if (findError) {
                    return rollback(findError);
                }

                if (stores.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({
                            message: "Store Not Found"
                        });
                    });
                }

                db.query(
                    "DELETE FROM rating WHERE store_id = ?",
                    [storeId],
                    (ratingsError) => {

                        if (ratingsError) {
                            return rollback(ratingsError);
                        }

                        db.query(
                            "DELETE FROM store WHERE id = ?",
                            [storeId],
                            (storeError) => {

                                if (storeError) {
                                    return rollback(storeError);
                                }

                                db.commit((commitError) => {

                                    if (commitError) {
                                        return rollback(commitError);
                                    }

                                    res.json({
                                        message: "Store Deleted Successfully"
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};

module.exports = {
    createAdminUser,
    getDashboardStats,
    getAllUsers,
    getAllStores,
    getUserById,
    deleteUser,
    deleteStore,
    getStoreById
};

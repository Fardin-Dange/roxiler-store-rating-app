const db = require("../config/db");

const createStore = (req, res) => {

    const {
        name,
        email,
        address,
        owner_id
    } = req.body;

    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedAddress = typeof address === "string" ? address.trim() : "";
    const ownerId = Number(owner_id);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedName) {
        return res.status(400).json({ message: "Store name is required" });
    }

    if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "A valid store email is required" });
    }

    if (!normalizedAddress) {
        return res.status(400).json({ message: "Store address is required" });
    }

    if (!Number.isInteger(ownerId) || ownerId <= 0) {
        return res.status(400).json({ message: "A valid owner ID is required" });
    }

    db.query(
        "SELECT id FROM users WHERE id = ? AND role = 'store_owner'",
        [ownerId],
        (ownerError, owners) => {
            if (ownerError) {
                return res.status(500).json({ message: ownerError.message });
            }

            if (owners.length === 0) {
                return res.status(400).json({ message: "Owner ID must belong to a store owner" });
            }

            db.query(
                "INSERT INTO store(name,email,address,owner_id) VALUES(?,?,?,?)",
                [normalizedName, normalizedEmail, normalizedAddress, ownerId],
                (error, result) => {
                    if (error) {
                        if (error.code === "ER_DUP_ENTRY") {
                            return res.status(409).json({ message: "A store with this email already exists" });
                        }

                        return res.status(500).json({ message: error.message });
                    }

                    res.status(201).json({
                        message: "Store Created Successfully",
                        storeId: result.insertId
                    });
                }
            );
        }
    );
};

const getAllStores = (req, res) => {

    const userId = req.user.id;

    const search = req.query.search || "";

    const sql = `
        SELECT
            s.id,
            s.name,
            s.address,

            ROUND(AVG(r.ratings),1) as overall_rating,

            (
                SELECT ratings
                FROM rating
                WHERE user_id = ?
                AND store_id = s.id
            ) as user_rating

        FROM store s

        LEFT JOIN rating r
        ON s.id = r.store_id

        WHERE
            s.name LIKE ?
            OR s.address LIKE ?

        GROUP BY s.id
    `;

    const searchValue = "%" + search + "%";

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

module.exports = {
    createStore,
    getAllStores
};

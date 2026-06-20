const db = require("../config/db");

const getOwnerDashboard = (req, res) => {

    const ownerId = req.user.id;

    const storeSql =
        "SELECT * FROM store WHERE owner_id = ?";

    db.query(
        storeSql,
        [ownerId],
        (err, storeResult) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (storeResult.length === 0) {
                return res.status(404).json({
                    message: "Store Not Found"
                });
            }

            const store = storeResult[0];

            const dashboardSql = `
                SELECT
                    u.name,
                    u.email,
                    r.ratings
                FROM rating r
                JOIN users u
                ON r.user_id = u.id
                WHERE r.store_id = ?
            `;

            db.query(
                dashboardSql,
                [store.id],
                (err, usersResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    const avgSql = `
                        SELECT
                        ROUND(AVG(ratings),1)
                        AS averageRating
                        FROM rating
                        WHERE store_id = ?
                    `;

                    db.query(
                        avgSql,
                        [store.id],
                        (err, avgResult) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            res.json({
                                storeName: store.name,
                                averageRating:
                                    avgResult[0].averageRating,
                                ratedUsers:
                                    usersResult
                            });

                        }
                    );

                }
            );

        }
    );

};


module.exports = {
    getOwnerDashboard
};
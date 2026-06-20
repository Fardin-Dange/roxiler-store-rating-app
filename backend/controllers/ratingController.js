const db = require("../config/db");

const submitRating = (req, res) => {

    const { store_id, rating } = req.body;

    const user_id = req.user.id;

    const sql =
        "INSERT INTO rating(user_id, store_id, ratings) VALUES(?,?,?)";

    db.query(
        sql,
        [user_id, store_id, rating],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Rating Submitted Successfully"
            });
        }
    );
};

const updateRating = (req, res) => {

    const user_id = req.user.id;

    const store_id = req.params.storeId;

    const { rating } = req.body;

    const sql =
        "UPDATE rating SET ratings=? WHERE user_id=? AND store_id=?";

    db.query(
        sql,
        [rating, user_id, store_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Rating Updated Successfully"
            });

        }
    );
};

module.exports = {
    submitRating,
    updateRating
};
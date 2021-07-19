const router = require('express').Router();
const User = require("../models/user");

router.get("/:query/:page", (req, res) => {
    const { query, page } = req.params
    const skip = page * 20 - 20
    User.find({ isArtist: true }).skip(skip).limit(20).populate("assets").exec((err, users) => {
        if (err) {
            res.status(500).send("Error");
        }
        if (users) {
            const searchresult = users.filter(user => {
                const { fullName } = user;
                const regex = new RegExp(query, "i");
                if (regex.test(fullName)) {
                    return user;
                }
            });
            res.status(200).send(searchresult);
        }
        else {

            res.status(204).send("No result")
        }
    })
});


module.exports = router;
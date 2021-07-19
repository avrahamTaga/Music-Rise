const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const tokenSecret = "aschaley#1@@avrache"
module.exports.signIN = (req, res) => {
    console.log("signin");
}   

module.exports.loginUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const requestUser = User.findOne({ email: email }).select("_id email password fullName assets profileImageUrl age");
    if (requestUser) {
        requestUser.exec((err, user) => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    res.send({ user: "jngvf" });
                }
                if (isMatch) {
                    jwt.sign({ email: email, password: password }, tokenSecret, (err, token) => {
                        const maxAge = 60 * 60 * 200000;
                        if (err) {
                            console.log(err);
                            return
                        }
                        res.cookie("rastamusicrise", token, { maxAge: maxAge });
                        User.findById(user._id).populate("assets").exec((err, user) => {
                            if (err) { console.log(err) }
                            res.status(200).json({ user: user });
                        });
                    });
                }
                else {
                    res.status(500).send("unable to login");
                }
            });
        });
    }
    else { res.status(204).send("Email not found") }
}

module.exports.isLogedIn = (req) => {
    const token = req.cookies.rastamusicrise;
    let payload
    if (!token) { return false }
    try {
        payload = jwt.verify(token, tokenSecret);
        if (payload) {
            return true
        }
    } catch (error) {
        console.log("Erro", error);
    }
}
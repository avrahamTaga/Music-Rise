const router = require('express').Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const auth = require("./auth");
const User = require('../models/user');

//! filename + folder configration
let Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "ProgileImages")
    },
    filename: function (req, file, cb) {
        console.log();
        cb(null, Date.now() + '-' + file.originalname)
    }
});

//! Chack the file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
        cb(null, true)
    } else {
        cb(new Error("only image file "), false)
    }
}

let upload = multer({
    storage: Storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/signin', upload.single("file"), (req, res) => {
    let file, body = req.body, newUser, adminStatus;
    if (req.file === undefined || req.file === "") {
        file = "default.webp";
    } else { file = "/" + req.file.filename; }

    body.isArtist ? adminStatus = 102 : adminStatus = 101
    // //! ECreate a new user
    if (body.password === body.confirmPassword) {
        newUser = new User({
            ...body,
            adminStatus: adminStatus,
            profileImageUrl: file
        });
    }

    // //! Encrypt the Password
    try {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { console.log(err + " !!!!error on "); }
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) { console.log(err + "  error Hereeee"); }
                else {
                    newUser.password = hash;
                    newUser.save();
                    res.status(201).json({
                        user: newUser,
                        message: 'success'
                    });
                    return
                }
            });
        });
    }
    catch (error) {
        console.log(error);
        res.send("Error occured");
    }
});

//!Login Handler
router.post('/login', (req, res, next) => {
    auth.loginUser(req, res);
    // res.json({ status: "success", user: req.user });
});

router.delete('/:id', (req, res, next) => {

});

//!Logiout Handler
router.get('/logout', function (req, res) {
    req.logout();
});



module.exports = router;
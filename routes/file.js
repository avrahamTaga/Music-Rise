const router = require('express').Router();
const multer = require("multer");
const auth = require("./auth");
const File = require('../models/file');
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

//! filename + folder configration
let Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "VideoAudio");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/wav" || file.mimetype === "audio/mp3" || file.mimetype === "video/mp4" || file.mimetype === "video/ogg") {
        cb(null, true)
    } else {
        cb(new Error("only audio/video file "), false)
    }
}

let upload = multer({
    storage: Storage,
    limits: { fileSize: 1024 * 1024 * 200 },
    fileFilter: fileFilter
}).single("userFile");

//Add a file
router.post('/upload', upload, (req, res) => {
    if (!auth.isLogedIn(req)) {
        res.send("unauthorized");
        return
    }
    try {
        let file = req.file;
        const logInUser = JSON.parse(req.body.user);
        User.findById(logInUser._id, (err, user) => {
            if (err) {
                res.send("Error happend");
                return
            }
            if (user) {
                let newFile = new File({
                    fileTitle: req.body.title,
                    description: req.body.description,
                    fileLink: file.filename,
                    isDownloadAble: req.body.isDownloadAble,
                    fullPath: file.path,
                    owner: user._id
                });

                newFile.save();
                user.assets.push(newFile);
                user.save().then(user => {
                    User.findById(user._id).populate("assets").exec((err, user) => {
                        res.json({ user: user });
                        return
                    });
                });
            }

            else {
                res.send("User didnt fount");
            }
        });
    } catch (error) {
        console.log("there a problem", error);
        res.send("");
    }
});

//Get All the files
router.get('/', (req, res) => {
    if (!auth.isLogedIn(req)) {
        res.send("unauthorized");
        return
    }
    try {
        File.find().populate("owner").populate("comments").populate("author").sort({ _id: -1 }).limit(15)
            .then(files => {
                res.send(files);
            })
            .catch(err => console.log("Error:**", err))
    } catch (error) {
        console.log(error);
        res.send("there is an error");
    }
});

//Get Specific file
router.get('/:id', (req, res) => {
    if (!auth.isLogedIn(req)) {
        res.send("unauthorized");
        return
    }

    File.findById(req.params.id, (err, file) => {
        if (err) {
            console.log(err);
            res.send("there is a problem to get the file");
            return
        }
        res.send(file);
    });
});


//Delete Route
router.delete('/:file_id/:user_id', (req, res) => {
    if (!auth.isLogedIn(req)) {
        res.send("only valid user");
        return
    }

    User.findById(req.params.user_id, (err, user) => {
        if (err) {
            console.log("Error: ", err);
            return
        }

        if (user) {
            File.findById(req.params.file_id, (err, file) => {
                if (err) {
                    console.log("Error", err);
                    res.send("There is some problems");
                    return
                }

                //Delete from the file system
                if (file && file.owner == req.params.user_id) {
                    fs.unlink(path.join("VideoAudio/" + file.fileLink), (err) => {
                        if (err) {
                            console.log("Error", err);
                            return res.send("unable to delete the file");
                        }
                        File.findByIdAndDelete({ _id: req.params.file_id }, (err, success) => {
                            user.assets = user.assets.filter(file => {
                                return file._id != req.params.file_id
                            });
                            console.log();
                            user.save();
                            if (success) {
                                return res.status(200).send(req.params.id);
                            }
                        })
                    });
                }
                else { res.status(204).send("file not found"); }
            });
        }
    });
});

router.get('/download/:id', (req, res) => {
    if (!auth.isLogedIn(req)) {
        res.send("unauthorized");
        return
    }

    File.findById(req.params.id)
        .then(file => {
            res.download(file.fileLink);
        })
        .catch(err => console.log("the file downloaded", err));
});

//Like Route Add & Remove
router.post("/like/:file_id/:user_id", (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err) {
            res.status(500).send("Error")
        } if (user) {
            File.findById(req.params.file_id, ((err, file) => {
                const isContain = user.likedFiles.includes(file._id);
                if (file) {
                    console.log(isContain);
                    if (!isContain) {
                        file.likes = file.likes + 1
                        file.save();
                        user.likedFiles.push(file);
                        user.save();
                        res.send("Added");
                    }
                    else {
                        file.likes = file.likes - 1
                        file.save();
                        user.likedFiles = user.likedFiles.filter(userlike => {
                            userlike !== file._id;
                        });
                        user.save();
                        res.status(200).send("Deleted");
                    }
                }
            }));
        }
    });
});

module.exports = router;
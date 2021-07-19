const router = require("express").Router();
const File = require("../models/file");
const User = require("../models/user");
const Comment = require("../models/comment");

router.post("/:file_id", (req, res) => {
    try {
        const body = req.body;
        User.findById(body.user._id, (err, user) => {
            File.findById(req.params.file_id, async (err, file) => {
                if (err) {
                    console.log("Error: ***", err);
                    res.send("there is an error");
                    return
                }
                if (!file) {
                    res.status(204).send("File not found")
                }
                else {
                    let newComment = new Comment({
                        authorName: user.fullName,
                        authorImage: user.profileImageUrl,
                        body: body.body
                    });
                    file.comments.push(newComment);
                    newComment.save();
                    file.save();
                    res.status(202).send(newComment);
                }
            });
        });

    } catch (error) {
        res.status(500).send("Eroor while commenting")
    }
});


router.delete("/:comment_id/:user_id/:file_id", (req, res) => {
    try {
        User.findById(req.params.user_id, (err, user) => {
            if (err) {
                return 'Error!!!123';
            }
            File.findById(req.params.file_id, (err, file) => {
                if (err) {
                    console.log("Error: ***", err);
                    res.send("there is an error");
                    return
                }

                if (file) {
                    let isMach = file.comments.includes(req.params.comment_id);
                    if (isMach) {
                        file.comments = file.comments.filter(commentId => {
                            return commentId != req.params.comment_id
                        })
                        file.save();
                        Comment.findByIdAndDelete(req.params.comment_id, async (err, comment) => {
                            if (comment) {
                                res.sendStatus(200)
                            }
                        });
                    }
                }
                else {
                    res.send(req.params.comment_id);
                }
            });
        });
    } catch (error) {
        res.status(500).send("Eroor while commenting")
    }
});


module.exports = router
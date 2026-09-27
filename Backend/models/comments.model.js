const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    body: {
        type: String,
        reuire: true
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
const express = require("express");
const router = express.Router();
const multer = require('multer');

const {commentPost} = require("../controllers/user.controller");

const {
    activeCheck,
    createPost,
    getAllPosts,
    deletePost,
    get_comments_by_post,
    delete_comment_of_user,
    Increment_Likes
} = require("../controllers/posts.controller");

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'uploads/')
    },
    filename: (req, file, cd) => {
        cd(null, file.originalname)
    },
});

const upload = multer({storage: storage});

router.get("/active", activeCheck);

router.post("/post", upload.single('media'), createPost);
router.get("/posts", getAllPosts);
router.post("/delete_post", deletePost);
router.post("/comment", commentPost);
router.get("/get_comments", get_comments_by_post);
router.delete("/delete_comment", delete_comment_of_user);
router.post("/increment_post_likes", Increment_Likes);

module.exports = router;

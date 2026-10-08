const express = require("express");
const router = express.Router();
const multer = require('multer');

const {
    activeCheck,
    createPost,
    getAllPosts,
    deletePost
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


module.exports = router;

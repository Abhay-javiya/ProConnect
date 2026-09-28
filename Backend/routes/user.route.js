const express = require("express");
const router = express.Router();
const multer = require('multer');
const {register, login, uploadProfilePicture} = require("../controllers/user.controller");

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'uploads/')
    },
    filename: (req, file, cd) => {
        cd(null, file.originalname)
    }
})

const upload = multer({storage: storage});

router.post("/register", register);
router.post("/login", login);
router.post('/update_profile_picture', upload.single('profile_picture'), uploadProfilePicture);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require('multer');
const {register, login, uploadProfilePicture, updateUserProfile} = require("../controllers/user.controller");

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
router.post('/user_update', updateUserProfile);
router('/get_user_and_profile');

module.exports = router;

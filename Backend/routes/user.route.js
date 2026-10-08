const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
    register, 
    login, 
    uploadProfilePicture, 
    updateUserProfile, 
    getUserAndProfile, 
    updateProfileData, 
    getAllUserProfiles,
    downloadProfile,
    sendConnectionRequest,
    getMyconnectionRequests,
    whatsMyConnectionStatus,
    acceptConnectionRequest
} = require("../controllers/user.controller");

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
router.get('/get_user_and_profile', getUserAndProfile);
router.post('/update_profile_data', updateProfileData);
router.get('/user/get_all_users', getAllUserProfiles);
router.get('/user/download_resume', downloadProfile);
router.post('/user/send_connection_request', sendConnectionRequest);
router.post('/user/getConnectionRequests', getMyconnectionRequests);
router.post('/user/user_connection_request', whatsMyConnectionStatus);
router.post('/user/accept_connection_request', acceptConnectionRequest);

module.exports = router;

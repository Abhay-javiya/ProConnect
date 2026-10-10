const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {PDFDocument } = require('pdfkit');
const fs = require('fs');

const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputpath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputpath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, { align: 'center', width: 100 });
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Bio: ${userData.Bio}`);
    doc.fontSize(14).text(`Current Post: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name : ${work.company}`);
        doc.fontSize(14).text(`Position : ${work.position}`);
        doc.fontSize(14).text(`Years : ${work.years}`);
    });

    doc.end();

    return outputpath;
}

const register = async (req,res) => {
    try{
        const {name, email, password, username} = req.body;

        if(!name || !email || !password || !username){
            return res.status(400).json({message: "All Fields are require ..."})
        }

        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({message: "User already exist ..."});

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password : hashPassword,
            username
        });

        await newUser.save();
        
        // After Register we create a Profile...
        const profile = new Profile({
            userId: newUser._id
        });

        await profile.save();

        return res.status(200).json({message: "User Was Created ..."})

    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

const login = async (req,res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: "All Field require..."});
        }

        const user = await User.findOne({
            email
        });

        if(!user)
            return res.status(404).json({message: "User does not exist..."})

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"})
        
        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({_id: user._id}, {token});

        return res.json({token: token});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const uploadProfilePicture = async (req, res) => {
    const {token} = req.body;

    try{
        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message: "User not found..."});
        }

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({message: "Profile Picture Updated..."});
        
    } catch (error) {
        return res.status(500).json({mesaage : error.mesaage});
    }
}

const updateUserProfile = async (req, res) => {
    try{
        const {token, ...newUser} = req.body;

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message: "User not Found..."});
        }

        const {username, email} = newUser;

        const existingUser = await User.findOne({ $or: [{username}, {email}] });

        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
                return res.status(400).json({message: "User already exist..."});
            }
        }

        Object.assign(user, newUser);

        await user.save();

        return res.json({message: "User Updated ..."});

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getUserAndProfile = async (req, res) => {
    try{
        const {token} = req.body;

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message: "User already exist..."});
        }

        const updateProfile = await Profile.findOne({userId: user._id})
            .populate('userId', 'name email, username, profilePicture');

        return res.json(updateProfile);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updateProfileData = async (req, res) => {
    try{
        const {token, ...newProfile} = req.body;

        const userProfile = await User.findOne({token: token});

        if(!userProfile){
            return res.status(404).json({message: "User not Found..."});
        }

        const profile_to_update = await Profile.findOne({userId: userProfile._id});

        Object.assign(profile_to_update, newProfile); 

        await profile_to_update.save();

        return res.json({message: "Profile Updated..."});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getAllUserProfiles = async (req, res) => {
    try{
        const profiles = await Profile.find().populate('userId', 'name email username profilePicture'); 

        return res.json({ profiles });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const downloadProfile = async (req, res) => {
    try {
        const user_Id = req.params.id;

        const userProfile = await Profile.findOne({ userId: user_Id })
        .populate('userId', 'name email username profilePicture');

        let a = await convertUserDataTOPDF(userProfile);

        return res.json({ "message": a });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const sendConnectionRequest = async (req, res) => {
    try {
        const { token, connectionId } = req.body; 
        
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }

        const connectionUser = await User.findById({ _id: connectionId });

        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found..." });
        }

        const existingRequest = await ConnectionRequest.findOne(
            { 
                userId: user._id, 
                connectionId: connectionUser._id 
            }
        );

        if (existingRequest) {
            return res.status(400).json({ message: "request already sent..." });
        }

        const newRequest = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await newRequest.save();

        return res.json({ message: "Connection request sent successfully..." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getMyconnectionRequests = async (req, res) => {
    try {
        const { token } = req.body; 

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate('connectionId', 'name email username profilePicture');

        return res.json({ connections });


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const whatsMyConnectionStatus = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }

        const connections = await ConnectionRequest.find({ connectioId: user._id })
            .populate('userId', 'name email username profilePicture');

        return res.json(connections);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const acceptConnectionRequest = async (req, res) => {  
    try {
        const { token, requestId, action_type } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }

        const connection = await ConnectionRequest.findById({ _id: requestId });

        if (!connection) {
            return res.status(404).json({ message: "Connection request not found..." });
        }

        if(action_type === "accept") {
            connection.status_accepted = true;
        } else{
            connection.status_accepted = false;
        }

        await connection.save();

        return res.json({ message: "Connection request updated successfully..." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    } 
}


const commentPost = async (req, res) => {
    try {
        const { token, postId, commentBody } = req.body;

        const user = await User.findOne({ token: token }).select('_id');

        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }

        const post = await Post.findById({ _id: postId });

        if (!post) {
            return res.status(404).json({ message: "Post not found..." });
        }

        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            comment: commentBody
        });

        await comment.save();

        return res.json({ message: "Comment added successfully..." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
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
    acceptConnectionRequest,
    commentPost
};

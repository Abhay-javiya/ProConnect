const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');


export const activeCheck = async (req,res) => {
    return res.status(200).json({message : "Running"});
}

const createPost = async (req, res) => {
    try{
        const {token} = req.body;

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        const post = new Post({
            userId: user._id,
            content: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/") : "",
        });

        await post.save();

        return res.status(201).json({message : "Post created successfully"});

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}



module.exports = {
    activeCheck,
    createPost
};
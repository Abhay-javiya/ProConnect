const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

        return res.json({token});

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



module.exports = {register, login, uploadProfilePicture, updateUserProfile};

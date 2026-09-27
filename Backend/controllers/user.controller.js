const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const bcrypt = require('bcrypt');

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

module.exports = register;

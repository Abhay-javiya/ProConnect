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

const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find()
            .populate('userId', 'name username email profilePicture');
        
        return res.json({posts});
    } catch (error){
        return res.status(500).json({message : error.message});
    }
}

const deletePost = async (req, res) => {
    try{
        const {token, post_id} = req.body;    

        const user = await User
            .findOne({token: token})
            .select('_id');

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        const post = await Post.findOne({_id: post_id});

        if(!post){
            return res.status(404).json({message : "Post not found"});
        }

        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message : "You are not authorized..."});
        }

        await Post.deleteOne({_id: post_id});

        return res.status(200).json({message : "Post deleted successfully..."});

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

const get_comments_by_post = async (req, res) => {
    try{

        const {post_id} = req.body;

        const post = await Post.findOne({_id: post_id});

        if(!post){
            return res.status(404).json({message : "Post not found"});
        }

        return res.json({comments : post.comments});

    } catch (error){
        return res.status(500).json({message : error.message});
    }
}

const delete_comment_of_user = async (req, res) => {
    try{
        const {token, comment_id} = req.body;

        const user = await User.findOne({token: token}).select('_id');

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        const comment = await Comment.findOne({"_id": comment_id});

        if(!comment){
            return res.status(404).json({message : "Comment not found"});
        }

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({message : "You are not authorized..."});
        }

        await Comment.deleteOne({"_id": comment_id});

        return res.json({message : "Comment deleted successfully..."});

    } catch (error){
        return res.status(500).json({message : error.message});
    }
}

module.exports = {
    activeCheck,
    createPost,
    getAllPosts,
    deletePost
};
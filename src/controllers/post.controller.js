//controller file
const {Types} = require("mongoose");
const statusCodes = require("../util/status-codes");
const response = require("../models/api/response.model");
const writeLog = require("../util/functions/write-log");
const getErrorLine = require("../util/functions/get-error-line");

const { uploadImage,deleteImage} = require("../util/functions/image-upload-helper");
//db
const { db } = require("../models/db");
const Post = db.post;
const User = db.user;

exports.createPost = async (req,res)=>{
 
 
    try{
        
        let {content,title } = req.body;
        let image = {};
        
        if (req.files && req.files.image) {
            //upload file
            
            let uploadRes = await uploadImage(req.files.image);

            if (uploadRes.status == "error") {
                return res.status(statusCodes.NOT_ACCEPTABLE)
                    .json(response("failed", uploadRes.message));
            }
    
            image = {
                image:uploadRes.message.image,
                type:uploadRes.message.type,
                size: uploadRes.message.size+""
            }
        }
        
        //save post
        await new Post({
            title:title,
            content:content,
            image:image,
            likes:[],
            createdBy:req.userId
        }).save();

        res.json(response("success", "new post added"));

    }catch(error){
 
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}


exports.getPosts = async (req,res)=>{
 
 
    try{
        

        let posts = await Post.find({

        })
        .sort({createdAt:-1});
        
        res.json(response("success", "your posts",{posts:posts}));

    }catch(error){
        console.log(error);
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.myPosts = async (req,res)=>{
 
 
    try{
        
        let userId = req.userId;
        console.log(userId);
        let posts = await Post.find({
            createdBy:userId
        })
        
        
        res.json(response("success", "your posts",{posts:posts}));

    }catch(error){
        console.log(error);
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.getPost = async (req,res)=>{
 
 
    try{
        let postId = req.params.postId;
        let dbPost = await Post.findById(postId);

        res.json(response("success", "post", { post: dbPost }));

    }catch(error){
 
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.updatePost = async (req,res)=>{
 
 
    try{
        let postId = req.params.postId;
        let { title, content } = req.body;
        let dbPost = await Post.findById(postId);
        let image = {
            image: dbPost.image.image,
            type: dbPost.image.type,
            size: dbPost.image.size
        }

        if (req.files && req.files.image) {
            //delete image
            await deleteImage(dbPost.image.image);

            //add new image
            let uploadRes = await uploadImage(req.files.image);

            if (uploadRes.status == "error") {
                return res.status(statusCodes.NOT_ACCEPTABLE)
                    .json(response("failed", uploadRes.message));
            }
            console.log(uploadRes);
            image = {
                image:uploadRes.message.image,
                type:uploadRes.message.type,
                size: uploadRes.message.size+""
            }
            
        }

        await Post.findByIdAndUpdate(postId, {
            title:title,
            content:content,
            image:image,
        });

        res.json(response("success", "post updated"));

    }catch(error){
 
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.archivePost = async (req,res)=>{
 
 
    try{
        let postId = req.params.postId;
        let post = await Post.findById(postId).select("isArchived");
        let message = "archived"
        let archiveAction = true;
        if (post.isArchived) {
            message = "un archived";
            archiveAction = false;
        }
       
        await Post.findByIdAndUpdate(postId, {
           isArchived:archiveAction 
        });
        res.json(response("success",
                          "post is "+message));

    }catch(error){
 
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}


exports.deletePost = async (req,res)=>{
 
 
    try{
        let postId = req.params.postId;
        
        await Post.findByIdAndDelete(postId);
    
        res.json(response("success", "post deleted"));

    }catch(error){
 
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}




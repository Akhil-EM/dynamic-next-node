//controller file
const moment = require("moment");
const statusCodes = require("../util/status-codes");
const response = require("../models/api/response.model");
const writeLog = require("../util/functions/write-log");
const getErrorLine = require("../util/functions/get-error-line");
//db
const { db } = require("../models/db");
const Chat = db.chat;

exports.createChat = async (req,res)=>{
 
 
    try{
        
        let { content } = req.body;
        let sendTo = req.params.sendTo;
        let userId = req.userId;
        
        await new Chat({
            message: content,
            sendBy: userId,
            receivedBy: sendTo,
        }).save();
        res.status(statusCodes.OK)
            .end();
          
    }catch(error){
        console.log(error);
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.getChats = async (req,res)=>{
 
 
    try{
        
        let userId = req.userId;
        let chattedTo = req.params.userId;
        console.log(userId,chattedTo);
        let modifiedChats = [];
        let chats = await Chat.find({
            $or: [
                {
                    "sendBy":userId,
                    "receivedBy":chattedTo
                },
                {
                    "sendBy":chattedTo,
                    "receivedBy":userId
                }
            
            ]
           
        })

        let demObj = {};
        chats.map(chat => {
            
            demObj = {};
            demObj.id = chat._id,
                demObj.message = chat.message;
            demObj.date = moment().format('MMMM Do YYYY, h:mm:ss a');
            demObj.sendByMe = chat.sendBy.toString() === userId ? true : false;
            modifiedChats.push(demObj);
        });
        
        res.status(statusCodes.OK)
            .json(response("success",
                "chats",
                {   
                    chats:modifiedChats
                }
            ))
          
    }catch(error){
        
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.deleteChat = async (req,res)=>{
 
 
    try{
        
        let userId = req.userId;
        let chatId = req.params.chatId;
        
        let chat = await Chat.findOne({
            _id: chatId,
            sendBy:userId
        });

        if (!chat) {
            return res.status(statusCodes.UNAUTHORIZED)
                      .json(response("failed","you'r unauthorized to remove this chat"))
        }

        var TWO_MIN=2*60*1000;
        if ((new Date - new Date(chat.createdAt)) > TWO_MIN) { 
            return res.status(statusCodes.UNPROCESSABLE_ENTITY)
                      .json(response("failed","can't remove this much old chat(more than 2 min)."))
        }

        await Chat.findByIdAndDelete(chat.id);

        res.status(statusCodes.OK)
            .json(response("success",
                "chat removed"
            ))
          
    }catch(error){
        console.log(error);
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

//controller file
 
const statusCodes = require("../util/status-codes");
const response = require("../models/api/response.model");
const writeLog = require("../util/functions/write-log");
const getErrorLine = require("../util/functions/get-error-line");
const {verifyPassword,generateJwtToken} = require("../util/functions/encryption-helper");
//db
const { db } = require("../models/db");
const User = db.user;
const Token = db.token;

exports.register = async (req,res)=>{
 
 
    try{
        
        let { email, name, password } = req.body;

        let DBuser = await User.findOne({ email: email })
                               .select("email");
        if (DBuser) {
            return res.status(statusCodes.NOT_ACCEPTABLE)
                .json(response("failed", "this  email already registered with us"));
        }

        await new User({
            email: email,
            name: name,
            hash: password,
            salt: password,
        }).save();
 
       res.status(statusCodes.OK)
          .json(response("success","registration success."))
    }catch(error){
 
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.login = async (req,res)=>{
 
    try{
        
        let { email, password } = req.body;

        let DBuser = await User.findOne({ email: email })
        
       
        if (!DBuser) {
            return res.status(statusCodes.NOT_ACCEPTABLE)
                .json(response("failed", "this email is not registered with us"));
        }
        if (!DBuser.isActive) {
            return res.status(statusCodes.NOT_ACCEPTABLE)
                .json(response("failed", "your account is not active"));
        }

      
        //generate token and login user
        let token = await generateJwtToken({
            id: DBuser.id,
            type:DBuser.type
        });

        await new Token({
            token: token,
            createdBy: DBuser.id
        }).save();
      
        res.status(statusCodes.OK)
            .json(response("success", "login success", {
                token: token,
                name:DBuser.name
            }));
        
    }catch(error){
        
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

exports.logout = async (req,res)=>{
 
 
    try{
        
        let token = await Token.deleteOne({ token: req.token });
        
        res.status(statusCodes.OK)
            .json(response("success", "you have successfully log out"));
        
    }catch(error){
        console.log(error);
        writeLog(__filename,getErrorLine(),error.message);
        res.status(statusCodes.INTERNAL_SERVER_ERROR)
           .json(response("error",error.message));
    }
}

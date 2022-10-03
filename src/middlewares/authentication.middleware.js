const statusCodes = require("../util/status-codes");
const response = require("../models/api/response.model");
const {verifyJwtToken} = require("../util/functions/encryption-helper");

const {db}  = require("../models/db");
const Token = db.token;

async function authenticateUser(req, res, next) {
    //getting token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]; //either undefined or the token
    if(!token){
       return res.status(statusCodes.NOT_FOUND)
                 .json(response("failed","token not found"));
    }else{
        
        //check in db
        let tokenResult = await Token.findOne({
                token: token,
                isActive:true,
            }).select("token");
        
        //verify with JWT
        let tokenRes = await verifyJwtToken(token);
        if (tokenRes.status !== "success" || !tokenResult) {
            return  res.status(statusCodes.UNAUTHORIZED)
                       .json(response("failed","invalid token "))
        }
       
        req.token = tokenResult.token;
        req.userId = tokenRes.data.id;
        req.userType = tokenRes.data.type;
        next();
            
    }
    
}




module.exports = authenticateUser;
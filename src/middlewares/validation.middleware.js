const {body,param,query,validationResult} = require("express-validator");
const statusCodes = require("../util/status-codes");
const response = require("../models/api/response.model");
 
const validateRegistration = ()=>{
    return [
        body("email", "not a valid email address").trim().isEmail(),
        body("name", "required").trim().notEmpty(),
        body("password", "must be at least 5 character long").trim().isLength({min:5}),
    ]
}

const validateLogin = ()=>{
    return [
        body("email", "not a valid email address").trim().isEmail(),
        body("password", "must be at least 5 character long").trim().isLength({min:5}),
    ]
}

const validatePosts = ()=>{
    return [
        body("title", "required").trim().notEmpty(),
        body("content", "required").trim().notEmpty()
    ]
}
const validateChat = ()=>{
    return [
        body("content", "required").trim().notEmpty()]
}
 
const validationStatus = (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    
   
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
   
    return res.status(statusCodes.UNPROCESSABLE_ENTITY)
              .json(response("failed","validation errors",{ errors: extractedErrors}));
  }
 
 
  module.exports = {
    validationStatus,
    validateRegistration,
    validateLogin,
    validatePosts,
    validateChat
  }

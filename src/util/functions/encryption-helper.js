require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generatePassword = async (password) => {
    const salt = await crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return {salt:salt,hash:hash};
}

const verifyPassword = async (password, salt, hash) => {
    const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return newHash === hash;
}

const generateJwtToken = async (payload,time) => {
    if (time) return await jwt.sign(payload,
                               process.env.TOKEN_SECRET,
                               { expiresIn: time })
    return await jwt.sign(payload, process.env.TOKEN_SECRET);
}

const verifyJwtToken = async (token) => {
    try {

        let data = await jwt.verify(token, process.env.TOKEN_SECRET);
        return { status: "success", data };

    } catch (error) {

        return { status: "failed", data:{} };

    }


}


module.exports = {
    generatePassword, 
    verifyPassword,
    generateJwtToken, 
    verifyJwtToken
};
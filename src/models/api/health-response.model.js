const APP_CONFIG = require("../../config/app.config"); 
 
const healthResponse = () =>{
    let dateTime = new Date();
    let timeStamp = new Date().getTime();
 
 
    return {
        program:APP_CONFIG.program,
        version:APP_CONFIG.version,
        release:APP_CONFIG.release,
        dateTime:dateTime,
        timeStamp:timeStamp,
        status:"success",
        code:200,
        message:"service is healthy",
        data:{} };
}
 
module.exports = healthResponse;

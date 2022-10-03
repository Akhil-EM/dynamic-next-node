//status can be success failed or error 
module.exports =  (status = "success",message = "OK",data = {}) => ({status,message,data}); 

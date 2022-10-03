const path = require("path"); 
  
//api models 
const healthResponse = require("../models/api/health-response.model"); 
const response = require("../models/api/response.model"); 
  
//statuscode 
const statusCodes = require("../util/status-codes"); 
  
function initializeBaseRoutes(app){ 
  
    //app base route 
    app.get("/",(req,res)=>  res.json(response("success","at application base")) ); 
  
    //health check route 
    app.get("/check-health",(req,res)=> res.json(healthResponse())); 
  
    //get application error logs 
    app.get("/logs/:token",(req,res)=>{ 
       const accessToken  = process.env.LOG_ACCESS_TOKEN; 
       let token = req.params.token; 
         
       if(token == accessToken) { 
          return res.sendFile(path.join(__dirname,"../","../","public/logs","app-log.txt")); 
       } 
  
       res.status(statusCodes.UNAUTHORIZED) 
          .json(response("failed","you don't have access here")); 
    })  
  
} 
  
  
function initializeApplicationRoute(app){ 
    app.use("/users",require("./route/users")); 
    app.use("/posts",require("./route/posts")); 
    app.use("/chats",require("./route/chat")); 
} 
  
function initializeErrorCatchingRoute(app){ 
    app.all("*",(req,res)=> 
            res.status(statusCodes.NOT_FOUND) 
            .json(response("failed","no API endpoint found."))); 
} 
  
module.exports = {initializeBaseRoutes,initializeApplicationRoute,initializeErrorCatchingRoute} 

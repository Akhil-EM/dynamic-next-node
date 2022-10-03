require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors"); 
const morgen = require("morgan"); 
const limitRequest = require("express-rate-limit"); 
const compress = require("compression");
const fileUpload = require("express-fileupload");
const path = require("path");
//other packages goes here 
 
const app = express(); 
const port = process.env.PORT; 
const projectName = require("./src/config/app.config").program; 
const response = require("./src/models/api/response.model"); 
 
//route 
const route = require("./src/routes"); 
 
//configure app 
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(cors()); 
app.use(morgen('tiny'));//logs of request and response 
app.use(express.static("public"))//share the public files 
app.use(compress())
//limiting concurrent request's 
//to prevent DOS and DOSS attacks 
//maximum 10 request in 30 seconds 
app.use(limitRequest({ 
    windowMs:1000 * 30, 
    max:10, 
    message:response("failed",429,false,"too many requests. try after sometime") 
})); 

//image upload config
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'public',"images"),
    createParentPath: true,
    limits: { fileSize: 1024 * 1024 },//1mb max file size
}));
 
//call routes 
route.initializeBaseRoutes(app); 
route.initializeApplicationRoute(app); 
route.initializeErrorCatchingRoute(app);//always call at the bottom of routes 
 
 
app.listen(port, console.log(`${projectName} running on http://localhost:${port}`)) 

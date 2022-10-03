const router = require("express").Router(); 
//validation and auth middleware called here 
const { validateRegistration,
        validationStatus,
        validateLogin} = require("../../middlewares/validation.middleware"); 
const authMiddleWare = require("../../middlewares/authentication.middleware");
const userController = require('../../controllers/user.controller'); 
  
router.post("/register",
    validateRegistration(),
    validationStatus,
    userController.register);

router.post("/login",
    validateLogin(),
    validationStatus,
    userController.login);

router.delete("/logout",
    authMiddleWare,
    userController.logout);
  
  
module.exports = router; 

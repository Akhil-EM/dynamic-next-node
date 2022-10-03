const router = require("express").Router(); 
//validation and auth middleware called here 
const { validationStatus,
        validateChat} = require("../../middlewares/validation.middleware"); 
const authMiddleWare = require("../../middlewares/authentication.middleware");
const chatController = require('../../controllers/chat.controller'); 
  
router.post("/:sendTo",
    authMiddleWare,
    validateChat(),
    validationStatus,
    chatController.createChat);

router.get("/:userId",
    authMiddleWare,
    chatController.getChats);

router.delete("/:chatId",
    authMiddleWare,
    chatController.deleteChat);

  
module.exports = router; 

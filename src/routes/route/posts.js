const router = require("express").Router(); 
//validation and auth middleware called here 
const { validationStatus,
        validatePosts} = require("../../middlewares/validation.middleware"); 
const authMiddleWare = require("../../middlewares/authentication.middleware");
const postController = require('../../controllers/post.controller'); 
  
router.post("/",
    authMiddleWare,
    validatePosts(),
    validationStatus,
    postController.createPost);

router.get("/:postId",
    authMiddleWare,
    postController.getPost);

router.get("/",
    authMiddleWare,
    postController.getPosts);

router.get("/my-posts/post",
    authMiddleWare,
    postController.myPosts);

router.put("/:postId",
    authMiddleWare,
    validatePosts(),
    validationStatus,
    postController.updatePost);

router.put("/archive/:postId",
    authMiddleWare,
    postController.archivePost);



router.delete("/:postId",
    authMiddleWare,
    postController.deletePost);

router.delete("/:postId/archive",
    authMiddleWare,
    postController.deletePost);
  
module.exports = router; 

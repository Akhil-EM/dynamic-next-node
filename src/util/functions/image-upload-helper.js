const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { readdir } = require('fs/promises');
const savePath = path.join(__dirname,"../../../","public", "images");

(async () => {
    try {
      //removing tmp files    
      const files = await readdir(savePath);
      for (const file of files) {
            if (file.startsWith("tmp-")) {
                await fs.unlinkSync(path.join(savePath, file));
            }
      }
        
    } catch (error) {
        console.log("unable to delete file "+error.message);
    }
 
})()

async function uploadImage(image) {
    let id = await uuidv4();
    let fileName = id + path.extname(image.name);

    try {
         //check for errors
        if (image.truncated) {
        
            return {status:"error",message:"file size is too big (1 mb is  max size)"};
    
        }

        if(image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png'){
            return {status:"error",message:"only jpegs and png supported"};
        }
    
        await image.mv(path.join(savePath, fileName));
         
        return {
            status: "success",
            message: {
                image: fileName,
                type: image.mimetype,
                size: image.size
            }
        };

    } catch (error) {
        return {
            status: "error",
            message: error.message
        }
    }

}

async function deleteImage(image) {
     try {
         
         await fs.unlinkSync(path.join(savePath, image));

         return {
             status: "success",
             message:"image removed"
         }
         
     } catch (error) {
        return {
            status: "error",
            message: error.message
        }
     }
} 



module.exports = {
    uploadImage,
    deleteImage
}
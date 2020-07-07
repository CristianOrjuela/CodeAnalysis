
// Import logger
const logger = require('../../utils/logger/logger');

// Import file system module
const fs = require("fs");

// Save image
async function saveImage(baseImage, path, img_name) {
    //Find extension of file
    try{
      const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
      const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));
      //Forming regex to extract base64 data of file.
      const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
      //Extract base64 data.
      const base64Data = baseImage.replace(regex, "");
      //Set filename and extension
      const filename = img_name+"."+ext
      const fullpath = path + filename

      //write the file
      fs.writeFileSync(fullpath, base64Data, 'base64');
      logger.info("ImageHandler:Save image: Image saved succesfully")
      return true
      //return {filename, localPath};
    }
    catch(err){
      logger.error("ImageHandler:Save image: " + err)
      return false
    }

}

module.exports = {
    saveImage : saveImage
  };
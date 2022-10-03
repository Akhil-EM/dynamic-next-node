require("dotenv").config();
const {connect,model,Schema,Types} = require("mongoose");
const conString = require("../../config/db.config").conString;

(async () => {
  try {
    //establish connection
    await connect(conString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4
    });
          
    console.log("connected to database...");
  } catch (error) {
    console.log(`something went wrong ${error}`)
  }
})();


const db = {};
db.token = require("./model/token.model.js")(model, Schema, Types);
db.user = require("./model/user.model.js")(model, Schema, Types);
db.post = require("./model/post.model.js")(model, Schema, Types);
db.chat = require("./model/chat.model.js")(model, Schema, Types);

module.exports = { db };

const { generatePassword} = require("../../../util/functions/encryption-helper");
module.exports = (model, Schema, Types) => {

    return model('user',
        Schema({
            email: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            hash: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true,
                enum: ["ADMIN", "USER"],
                default:"USER"
            },
            isActive: {
                type: Boolean,
                default: true,
                required:true
            }
        },
        { timestamps: true })
            .pre("save", async function (next) {
            
            if (!this.isModified("hash"))return next();
            
            //generate password hash and salt
            let result = await generatePassword(this.hash);
            
            this.hash = result.hash;
            this.salt = result.salt;
            next();
        })

    );
}

    

    
const { generatePassword} = require("../../../util/functions/encryption-helper");
module.exports = (model, Schema, Types) => {
    //images schema

    
    return model('post',
        Schema({
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            image: {
                image: {
                    type: String
                },
                type: {
                    type: String
                },
                size: {
                    type: String
                }
            },
            isArchived: {
                type: Boolean,
                default: false,
                required: true
            },
            createdBy: {
                type: Types.ObjectId,
                ref: "user"
            },
            likes: {
                name: String,
                id: String
            }
        },
            { timestamps: true })
    );
}

    

    
module.exports = (model, Schema, Types) => {

    return model('token',
        Schema({
            token: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true,
                enum: ["AUTH"],
                default:"AUTH"
            },
            createdBy: {
                type: Types.ObjectId,
                ref:"users"
            },
            isActive: {
                type: Boolean,
                default: true,
                required:true
            }
        },
        {timestamps:true})

    );
}

    

    
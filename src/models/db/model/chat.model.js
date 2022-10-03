module.exports = (model, Schema, Types) => {

    return model('chat',
        Schema({
            message: {
                type: String,
                required: true
            },
            sendBy: {
                type: Types.ObjectId,
                ref:"user"
            },
            receivedBy: {
                type: Types.ObjectId,
                ref:"user"
            },
            hasSeen: {
                type: Boolean,
                default: true,
                required:true
            }
        },
        {timestamps:true})

    );
}

    

    
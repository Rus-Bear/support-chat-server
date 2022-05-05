const { Schema, model} = require("mongoose")

const Chat = new Schema({
    userInfo: {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String}
    },
    messages: [{
            username: {type: String, required: true},
            text: {type: String, required: true}
    }]
})

module.exports = model('Chat', Chat)
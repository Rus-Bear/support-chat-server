const Chat = require('../models/Chat')

class ChatsService {
    async getAllChats() {
        return Chat.find()
    }
    async getCurrentChat(email) {
        return Chat.findOne({'userInfo.email': email})
    }
}

module.exports = new ChatsService()
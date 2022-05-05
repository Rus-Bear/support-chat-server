const ChatsService = require("../services/ChatsService");

class ChatsController {
    async getAllChats(req, res, next) {
        try {
            const chats = await ChatsService.getAllChats()
            res.status(200).json(chats)
        } catch (e) {
            next(e)
        }
    }

    async getCurrentChat(req, res, next) {
        try {
            const { email } = req.body
            const chat = await ChatsService.getCurrentChat(email)
            res.status(200).json(chat)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new ChatsController()
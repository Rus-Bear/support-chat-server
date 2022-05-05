const router = require('express').Router()
const ChatsController = require('../controllers/ChatsController')

router.get('', ChatsController.getAllChats)
router.post('/current', ChatsController.getCurrentChat)

module.exports = router
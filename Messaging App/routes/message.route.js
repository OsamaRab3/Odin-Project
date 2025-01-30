

const express = require('express')
const router = express.Router()


const verifyToken = require('../middleware/verifyToken')
const messageController = require('../controllers/message.controllers')

router.route('/:chatId')
    .get(verifyToken,messageController.getAllMessage)
    .post(verifyToken,messageController.createMessage)

router.route("/:senderId/:reciverI")
    .post(verifyToken,messageController.createChat)
    .get(verifyToken,messageController.getExistingChat)


module.exports = router;



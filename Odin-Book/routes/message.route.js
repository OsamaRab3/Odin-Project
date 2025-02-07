const messageController = require('../controller/messageController')
const verifyToken = require('../middleware/verfytokn')




const express = require ('express')

const router = express.Router()


router.route('/')
    .post(verifyToken,messageController.createMessage)

    .get(verifyToken,messageController.getAllMessage)



module.exports = router;
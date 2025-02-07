const controller = require('../controller/authController')
const userController = require('../controller/UserController')

const verifyToken = require('../middleware/verfytokn')

const express = require('express')

const router = express.Router()




router.route('/login')
    .post(controller.login)

router.route('/signup')
    .post(controller.signup)



router.route('/')
    .get(verifyToken,userController.getAllUser)



router.route('/:userId')
    .get(verifyToken,userController.getUserInfo)



router.route('/comment')
    .post(verifyToken,userController.createComment)

router.route('/:followerId/:followingId')
    .put(verifyToken,userController.followToggle)

router.route('/:commentId/:userId')
    .delete(verifyToken,userController.deleteComment)



module.exports = router;
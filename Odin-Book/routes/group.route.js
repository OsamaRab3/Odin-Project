const groupController = require('../controller/groupController')
const verifyToken = require('../middleware/verfytokn')


const express = require("express")
const router = express.Router()





router.route('/')
    .post(verifyToken,groupController.createGroup)
    .get(verifyToken,groupController.getAllGroups)

router.route('/post')
    .post(verifyToken,groupController.createPost)




router.route('/:postId/:groupId/:authorId')
    .delete(verifyToken,groupController.deletePost)


router.route('/:groupId')
    .get(verifyToken,groupController.getUsers)


router.route('/:userId/:groupId')
    .post(verifyToken,groupController.addMember)


module.exports = router;
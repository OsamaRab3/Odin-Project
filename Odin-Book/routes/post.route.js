
const express = require('express')
const router = express.Router()

const postController = require('../controller/postController')
const toggelLike = require('../utils/add_removeLike')

const verifyToken = require('../middleware/verfytokn')



router.route('/')
    .post(verifyToken,postController.createPost)
    .get(verifyToken,postController.getPosts)
    .put(verifyToken,postController.updatePost)


router.route('/share')
    .post(verifyToken,postController.sharePost)

router.route('/:postId')
    .delete(verifyToken,postController.deletePost)


router.route('/:userId/:itemId/:type')
    .put(verifyToken,toggelLike.addLike)
    .delete(verifyToken,toggelLike.removeLike)






module.exports = router ;
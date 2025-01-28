
const express = require('express')
const router = express.Router()











const commentController = require('../controllers/comment_controller')
const verifyToken = require('../middleware/verifyToken')
router.route('/comments/:articleId')
.get(verifyToken,commentController.getComments)


router.route('/createComment')
.post(verifyToken,commentController.createComment)


module.exports = router;
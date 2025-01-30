

const express = require('express')
const router = express.Router()


const verifyToken = require('../middleware/verifyToken')
const groupController= require('../controllers/group.controller')








router.route('/groups/:userId')
    .get(verifyToken,groupController.getGroups)
router.route('/:groupId')
    .get(verifyToken,groupController.getOldMessageFromGroup)

router.route('/create')
    .post(verifyToken,groupController.createGroup)

router.route('/:userId/:groupId')
    .post(verifyToken,groupController.addMember)
    .get(verifyToken,groupController.getAllMemberInGroup)
    .delete(verifyToken,groupController.deleteMember)





router.route('/')
.   post(verifyToken,groupController.createMessageInGroup)



module.exports = router;




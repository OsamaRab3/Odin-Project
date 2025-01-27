const express = require('express')
const folderController = require('../controllers/folder.controller')
const {isAuthenticated} = require('../config/passport')

const router = express.Router()



router.route('/create')
.post(isAuthenticated,folderController.createFolder)



router.route('/folders/:userId')
.get(isAuthenticated,folderController.getAllFolder)



router.route('/delete/:folderId/:userId')
.delete(isAuthenticated,folderController.deleteFolder)


module.exports = router;

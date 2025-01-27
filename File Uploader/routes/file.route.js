const express = require('express')
const multer  = require('multer')
const fileController = require('../controllers/file.contrller')
const {isAuthenticated} = require('../config/passport')
const router = express.Router()

// check for auth


const diskStorage = multer.diskStorage({
  destination:function(req,file,cb){
    console.log("FILE=>: ",file);
    cb(null,"uploads")
  },
  filename:function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    const uniqueSuffix =`upload_${Date.now()}.${ext}`
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

router.route('/files/:userId')
.get(isAuthenticated,fileController.getAllFiles)



router.route('/delete/:fileId/:folderId/:userId')
.delete(isAuthenticated,fileController.deleteFile)



const upload = multer({storage:diskStorage})


router.route('/upload')
.post(isAuthenticated,upload.single('file'),fileController.uploadFile)




module.exports = router;

const express = require("express");
const router = express.Router();
const controllerMessage = require("../controllers/messages.controllers")




router.route('/')
.get (controllerMessage.getAllMessages)

router.route('/new')
    .get(controllerMessage.formPage)
router.route('/new')
    .post(controllerMessage.addNewMessage)

module.exports = router;
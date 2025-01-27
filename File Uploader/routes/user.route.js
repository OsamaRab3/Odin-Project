const express = require('express')
const userController = require('../controllers/auth')
const {loginValidation,signupValidation} = require('../middleware/Validation')
const router = express.Router()

router.route('/login')
.post(loginValidation(),userController.login)

router.route('/signup')
.post(signupValidation(),userController.signup)



module.exports = router;
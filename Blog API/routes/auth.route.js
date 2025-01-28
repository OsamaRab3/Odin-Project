const express = require('express')


const router = express.Router()


const userController = require('../controllers/auth')
const {loginValidation,signupValidation} = require('../middleware/validation')


router.route('/login')
.post(loginValidation(),userController.login)

router.route('/signup')
.post(signupValidation(),userController.signup)


module.exports = router;







const express = require('express')
const router = express.Router()


const verifyToken = require('../middleware/verifyToken')
const {loginValidation,signupValidation}= require('../middleware/validation')
const authController = require('../controllers/auth')


router.route('/login')
    .post(loginValidation(),authController.login)



router.route('/signup')
    .post(signupValidation(),authController.signup)


router.route('/users')
    .get(verifyToken,authController.getAllUser)



module.exports = router;




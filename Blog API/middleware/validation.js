const { body } = require('express-validator')

const commentValidation = () => {
    return [
        body("message").notEmpty().withMessage("Comment is required")
    ]
}

const loginValidation = () => {
    return [
        body('email').isEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password required')
    ]
};

const signupValidation = ()=>{
    return[
        body('name').notEmpty().withMessage("name required"),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password required')
        
    ]
}

module.exports = {
    commentValidation,
    loginValidation,
    signupValidation
}
const jwt = require("jsonwebtoken");

const generateJWT = (user)=>{

    const token = jwt.sign({
        id:user.id,
        name:user.name
    },process.env.JWT,
    {
        expiresIn:process.env.expiresIn
    })
    return token
}

module.exports = generateJWT;
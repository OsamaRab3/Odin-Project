const jwt = require('jsonwebtoken');

const generateJWT = (user) => {

    try {
        return jwt.sign(
            {
                name: user.name,
                role:user.role,
                id:user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );
    } catch (error) {
        console.error('JWT generation error:', error);
        throw new Error('Failed to generate token');
    }
};

module.exports = generateJWT;
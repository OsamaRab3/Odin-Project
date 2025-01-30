
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma')
const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Missing or invalid authorization header" });
    }


    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
        where:{
            id:decoded.id,

        },select:{
          id:true,
          name:true,
        }
    })
   
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.currentUser = user;

    next();

  } catch (error) {
    console.error('Token verification error:', error.message);
    
    const message = error.name === 'TokenExpiredError' 
      ? "Token expired" 
      : "Invalid token";
      
    res.status(401).json({ message });
  }
};

module.exports = verifyToken;
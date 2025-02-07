const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
 
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }


  const token = authHeader.split(' ')[1];; 
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: 'Invalid token.'
    });
  }
};

module.exports = verifyToken;

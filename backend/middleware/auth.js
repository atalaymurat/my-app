// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
   try {
    // 1. Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach user to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }

};

module.exports = authMiddleware;
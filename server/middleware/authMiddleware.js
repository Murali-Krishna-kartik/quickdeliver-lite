const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  // Check both cookie token and Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ No token found in cookies or headers');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Verify the user exists in DB
    req.user = {
      _id: decoded._id,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    console.log('❌ Invalid token:', err.message);
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid token' });
  }
};
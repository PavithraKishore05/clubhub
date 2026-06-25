import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verifies the JWT (from the httpOnly cookie, or an Authorization: Bearer
 * header as a fallback for non-browser clients) and loads the user onto
 * req.user. Responds 401 if the token is missing, invalid, or the user
 * no longer exists.
 */
export const protect = async (req, res, next) => {
  let token = req.cookies?.jwt;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};

/**
 * Restricts a route to specific roles. Use after `protect`.
 * Example: router.delete('/users/:id', protect, requireRole('admin'), ...)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};

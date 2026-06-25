import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for the given user and attaches it as an httpOnly cookie
 * on the response. Returns the raw token as well, in case a caller
 * needs it (e.g. for non-browser API clients).
 */
const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // not readable by JavaScript in the browser
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export default generateToken;

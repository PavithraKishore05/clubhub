import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const ALLOWED_ROLES = ['user', 'admin'];

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// @route   POST /auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const finalRole = ALLOWED_ROLES.includes(role) ? role : 'user';
    const user = await User.create({ name, email, password, role: finalRole });

    generateToken(res, user._id, user.role);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0]?.message || 'Invalid input';
      return res.status(400).json({ message });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Something went wrong while creating the account' });
  }
};

// @route   POST /auth/login  — accepts email OR username
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const identifier = email.toLowerCase().trim();

    // Find by email OR by username (admin accounts use username)
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    generateToken(res, user._id, user.role);
    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong while signing in' });
  }
};

// @route   GET /auth/me (protected)
export const getMe = async (req, res) => {
  return res.status(200).json({ user: publicUser(req.user) });
};

// @route   POST /auth/logout
export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ message: 'Logged out successfully' });
};

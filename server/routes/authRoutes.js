const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { login, register, logout } = require('../controllers/authController');
const User = require('../models/User'); 
const Delivery = require('../models/Delivery');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register and login
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    const deliveryCount = await Delivery.countDocuments({ createdBy: user._id });

    res.json({ user, deliveryCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// routes/authRoutes.js
router.put('/update-profile', authenticate, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check for duplicate email (optional but recommended)
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ user });

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

router.put('/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword; // gets hashed in pre-save
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error while changing password' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('name email role');
    res.json({ user });
  } catch (err) {
    console.error('Auth Me Error:', err);
    res.status(500).json({ error: 'Failed to load user' });
  }
});
const passport = require('passport');

// Start Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: true,
  }),
  (req, res) => {
    try {
      // Create JWT token
      const token = jwt.sign(
        { _id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000 // 1 hour
      });

      // Successful redirect
      res.redirect('http://localhost:5173/google-success');
    } catch (err) {
      console.error('JWT Error:', err);
      res.redirect('http://localhost:5173/login?error=jwt_error');
    }
  }
);

// Optional: Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.send({ message: 'Logged out' });
  });
});


module.exports = router;

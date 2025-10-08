const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// expects db object where db.User exists
module.exports = (db) => {
  const User = db.User;

  return {
    signUp: async (req, res) => {
      try {
        const { emailOrPhone, password, displayName } = req.body;
        if (!emailOrPhone || !password) {
          return res.status(400).json({ message: 'Email/Phone and password required' });
        }

        const existing = await User.findOne({ where: { emailOrPhone }});
        if (existing) {
          return res.status(409).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({
          emailOrPhone,
          passwordHash: hash,
          displayName
        });

        // create token
        const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({ userId: user.userId, token });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
    },

    signIn: async (req, res) => {
      try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) return res.status(400).json({ message: 'Missing credentials' });

        const user = await User.findOne({ where: { emailOrPhone }});
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({ token, userId: user.userId, displayName: user.displayName });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
    },

    forgotPassword: async (req, res) => {
      try {
        const { emailOrPhone } = req.body;
        if (!emailOrPhone) return res.status(400).json({ message: 'Email or phone required' });

        const user = await User.findOne({ where: { emailOrPhone }});
        if (!user) return res.status(200).json({ message: 'If account exists, password reset instructions were sent.' });

        // In a real app: create token, save token+expiry and send email/SMS with link.
        const crypto = require('crypto');
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(expires);
        await user.save();

        // TODO: send token to user's email or phone
        // For now return token (dev only)
        return res.json({ message: 'Reset token created (dev)', token });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  };
};
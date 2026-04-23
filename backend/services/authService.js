const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { seedDefaultCategories } = require('../utils/seedCategories');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('This email is already in use. Try logging in or use a different one.');
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  // Seed default categories for the new user
  await seedDefaultCategories(newUser._id);

  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: { id: newUser._id, name: newUser.name, email: newUser.email }
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('We couldn\'t find an account with that email.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials. Please double-check your password.');
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email }
  };
};

module.exports = {
  registerUser,
  loginUser
};

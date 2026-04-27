const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const register = async ({ name, email, password, role }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) throw new Error('Email already registered.');

  const password_hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ name, email, password_hash, role });
  return user;
};

const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error('Invalid email or password.');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid email or password.');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = { register, login };

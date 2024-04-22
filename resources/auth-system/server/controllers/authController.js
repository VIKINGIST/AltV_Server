const { createUser, getUserByEmail, getUserByHardwareId } = require('../models/user');
const bcrypt = require('bcrypt');

async function register(username, email, password, hardwareId) {
  const existingUser = await getUserByHardwareId(hardwareId);
  if (existingUser) {
    throw new Error('User with this hardware ID already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(username, email, hashedPassword, hardwareId);
}

async function login(email, password) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return user;
}

module.exports = {
  register,
  login
};
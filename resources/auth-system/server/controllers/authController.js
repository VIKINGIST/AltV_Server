// server/controllers/authController.js

const { createUser, getUserByEmail, getUserByHardwareId } = require('../models/user');
const bcrypt = require('bcrypt');

async function register(username, email, password, hardwareId) {
  // Перевірка, чи користувач з таким hardwareId вже існує
  const existingUser = await getUserByHardwareId(hardwareId);
  if (existingUser) {
    throw new Error('User with this hardware ID already exists');
  }

  // Хешування паролю перед збереженням
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача
  await createUser(username, email, hashedPassword, hardwareId);
}

async function login(email, password) {
  // Отримання користувача за електронною поштою
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Перевірка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Повернення даних користувача або токена автентифікації
  return user;
}

module.exports = {
  register,
  login
};
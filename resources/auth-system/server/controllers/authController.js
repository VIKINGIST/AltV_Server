const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');
const { generateToken, generateResetToken } = require('../utils/tokenUtils');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');

async function register(player, username, email, password) {
  try {
    const hardwareId = getHardwareId(player);
    const hashedPassword = await hashPassword(password);
    const newUser = await userController.createUser(username, email, hashedPassword, hardwareId);
    const token = generateToken(newUser.id);
    alt.emitClient(player, 'auth:register', token);
  } catch (error) {
    console.error('Error during registration:', error);
    player.send(`Сталася помилка під час реєстрації: ${error.message}`);
  }
}

async function login(player, email, password) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Неправильна електронна пошта або пароль');
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Неправильна електронна пошта або пароль');
    }

    const token = generateToken(user.id);
    alt.emitClient(player, 'auth:loginSuccess', token);
  } catch (error) {
    console.error('Error during login:', error);
    player.send(`Сталася помилка під час входу: ${error.message}`);
  }
}

async function resetPassword(player, email) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Користувач з такою електронною поштою не знайдений');
    }

    const resetToken = generateResetToken(user.id);
    // TODO: Реалізувати відправку електронного листа з токеном скидання паролю
    player.send('На вашу електронну пошту відправлено листа з інструкціями для скидання паролю');
    alt.emitClient(player, 'auth:resetPasswordToken', resetToken);
  } catch (error) {
    console.error('Error during password reset:', error);
    player.send(`Сталася помилка під час скидання паролю: ${error.message}`);
  }
}

async function resetPasswordWithToken(player, token, newPassword) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'reset') {
      throw new Error('Неправильний токен скидання паролю');
    }

    const userId = decoded.userId;
    const hashedPassword = await hashPassword(newPassword);
    await userController.updateUserPassword(userId, hashedPassword);

    player.send('Ваш пароль успішно змінено');
  } catch (error) {
    console.error('Error during password reset with token:', error);
    player.send(`Сталася помилка під час скидання паролю: ${error.message}`);
  }
}

module.exports = {
  register,
  login,
  resetPassword,
  resetPasswordWithToken
};
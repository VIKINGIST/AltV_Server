require('dotenv').config();
const alt = require('alt-server');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

function getHardwareId(player) {
  let hardwareId;
  if (player && player.valid) {
    hardwareId = alt.Player.local.getSyncedMeta('hardwareId') || alt.getUniqueId(player);
    alt.Player.local.setSyncedMeta('hardwareId', hardwareId);
  }
  return hardwareId;
}

alt.onClient('auth:register', async (player, username, email, password) => {
  try {
    const hardwareId = getHardwareId(player);
    await authController.register(player, username, email, password, hardwareId);
  } catch (error) {
    console.error('Error during registration:', error);
    player.send(`Сталася помилка під час реєстрації: ${error.message}`);
  }
});

alt.onClient('auth:login', async (player, email, password) => {
  try {
    await authController.login(player, email, password);
  } catch (error) {
    console.error('Error during login:', error);
    player.send(`Сталася помилка під час входу: ${error.message}`);
  }
});

alt.onClient('auth:resetPassword', async (player, email) => {
  try {
    await authController.resetPassword(player, email);
  } catch (error) {
    console.error('Error during password reset:', error);
    player.send(`Сталася помилка під час скидання паролю: ${error.message}`);
  }
});

alt.onClient('auth:resetPasswordWithToken', async (player, token, newPassword) => {
  try {
    await authController.resetPasswordWithToken(player, token, newPassword);
  } catch (error) {
    console.error('Error during password reset with token:', error);
    player.send(`Сталася помилка під час скидання паролю: ${error.message}`);
  }
});

// Інші обробники подій та логіка сервера
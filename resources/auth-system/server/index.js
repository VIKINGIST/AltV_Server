require('dotenv').config();
const alt = require('alt-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser, updateUserPassword } = require('./database');

// Секретний ключ для підпису JWT
const jwtSecret = process.env.JWT_SECRET;

// Генерація JWT
function generateToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
}

// Генерація токену скидання паролю
function generateResetToken(userId) {
  return jwt.sign({ userId, type: 'reset' }, jwtSecret, { expiresIn: '1h' });
}

// Реєстрація
alt.onClient('register', async (player, email, password) => {
  try {
    // Валідація вхідних даних
    if (!email || !password) {
      player.send('Неправильний формат команди. Використання: /register <email> <password>');
      return;
    }

    // Перевірка, чи існує вже користувач з такою електронною поштою
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      player.send('Користувач з такою електронною поштою вже існує');
      return;
    }

    // Хешування паролю
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const newUser = await createUser(email, hashedPassword);

    // Генерація та відправка JWT
    const token = generateToken(newUser.id);
    alt.emitClient(player, 'auth:register', token);
  } catch (error) {
    console.error('Error during registration:', error);
    player.send('Сталася помилка під час реєстрації');
  }
});

// Авторизація
alt.onClient('login', async (player, email, password) => {
  try {
    // Валідація вхідних даних
    if (!email || !password) {
      player.send('Неправильний формат команди. Використання: /login <email> <password>');
      return;
    }

    // Пошук користувача за електронною поштою
    const user = await getUserByEmail(email);
    if (!user) {
      player.send('Неправильна електронна пошта або пароль');
      return;
    }

    // Перевірка паролю
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      player.send('Неправильна електронна пошта або пароль');
      return;
    }

    // Генерація та відправка JWT
    const token = generateToken(user.id);

    // Відправка події 'auth:loginSuccess' клієнту
    alt.emitClient(player, 'auth:loginSuccess', token);
  } catch (error) {
    console.error('Error during login:', error);
    player.send('Сталася помилка під час входу');
  }
});

// Відновлення паролю
alt.onClient('resetPassword', async (player, email) => {
  try {
    // Валідація вхідних даних
    if (!email) {
      player.send('Неправильний формат команди. Використання: /resetpassword <email>');
      return;
    }

    // Пошук користувача за електронною поштою
    const user = await getUserByEmail(email);
    if (!user) {
      player.send('Користувач з такою електронною поштою не знайдений');
      return;
    }

    // Генерація токену скидання паролю
    const resetToken = generateResetToken(user.id);

    // TODO: Реалізувати відправку електронного листа з токеном скидання паролю

    player.send('На вашу електронну пошту відправлено листа з інструкціями для скидання паролю');
  } catch (error) {
    console.error('Error during password reset:', error);
    player.send('Сталася помилка під час скидання паролю');
  }
});

// Обробка скидання паролю з токеном
alt.onClient('resetPasswordWithToken', async (player, token, newPassword) => {
  try {
    // Перевірка токену скидання паролю
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.type !== 'reset') {
      player.send('Неправильний токен скидання паролю');
      return;
    }

    const userId = decoded.userId;

    // Хешування нового паролю
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Оновлення паролю користувача
    await updateUserPassword(userId, hashedPassword);

    player.send('Ваш пароль успішно змінено');
  } catch (error) {
    console.error('Error during password reset with token:', error);
    player.send('Сталася помилка під час скидання паролю');
  }
});
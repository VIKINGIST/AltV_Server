const alt = require('alt-server');
const chat = alt.chat;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Функція для генерації JWT
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

// Реєстрація
chat.registerCmd('/register', async (player, _, args) => {
  const [email, password] = rawArgs.split(' ');

  // Валідація вхідних даних
  if (!email || !password) {
    player.send('Неправильний формат команди. Використання: /register <email> <password>');
    return;
  }

  // Перевірка, чи існує вже користувач з такою електронною поштою
  const existingUser = await database.getUserByEmail(email);
  if (existingUser) {
    player.send('Користувач з такою електронною поштою вже існує');
    return;
  }

  // Хешування паролю
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача
  const newUser = await database.createUser(email, hashedPassword);

  // Генерація та відправка JWT
  const token = generateToken(newUser.id);
  alt.emitClient(player, 'auth:register', token);
});

// Авторизація
chat.registerCmd('/register', async (player, _, args) => {
  const [email, password] = rawArgs.split(' ');

  // Валідація вхідних даних
  if (!email || !password) {
    player.send('Неправильний формат команди. Використання: /login <email> <password>');
    return;
  }

  // Пошук користувача за електронною поштою
  const user = await database.getUserByEmail(email);
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
  alt.emitClient(player, 'auth:login', token);
});

// Відновлення паролю
chat.registerCmd('/resetpassword', async (player, _, args) => {
  const [email] = rawArgs.split(' ');

  // Валідація вхідних даних
  if (!email) {
    player.send('Неправильний формат команди. Використання: /resetpassword <email>');
    return;
  }

  // Пошук користувача за електронною поштою
  const user = await database.getUserByEmail(email);
  if (!user) {
    player.send('Користувач з такою електронною поштою не знайдений');
    return;
  }

  // Генерація токену скидання паролю
  const resetToken = generateResetToken(user.id);

  // Відправка електронного листа з токеном скидання паролю
  sendResetPasswordEmail(email, resetToken);

  player.send('На вашу електронну пошту відправлено листа з інструкціями для скидання паролю');
});

// Обробка токену скидання паролю (додаткова логіка)
// ...
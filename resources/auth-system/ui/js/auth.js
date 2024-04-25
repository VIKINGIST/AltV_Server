// Отримання посилань на елементи
const switchToLogin = document.getElementById('switch-to-login');
const switchToRegister = document.getElementById('switch-to-register');
const switchToReset = document.getElementById('switch-to-reset');
const forms = document.querySelectorAll('form');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const resetPasswordForm = document.getElementById('reset-password-form');

// Обробники подій для форм
registerForm.addEventListener('submit', (e) => registerHandler(e));
loginForm.addEventListener('submit', (e) => loginHandler(e));
resetPasswordForm.addEventListener('submit', (e) => resetPasswordHandler(e));

// Обробники подій для перемикання форм
switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  showForm('login');
});

switchToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  showForm('register');
});

switchToReset.addEventListener('click', (e) => {
  e.preventDefault();
  showForm('reset');
});

// Функція для відображення форми на основі типу
function showForm(formType) {
  forms.forEach(form => form.style.display = 'none');
  switch (formType) {
    case 'login':
      loginForm.style.display = 'block';
      break;
    case 'register':
      registerForm.style.display = 'block';
      break;
    case 'reset':
      resetPasswordForm.style.display = 'block';
      break;
  }
}

// Обробник події для відображення форми на основі отриманого повідомлення
window.addEventListener('message', (event) => {
  if (event.data.event === 'auth:showForm') {
    showForm(event.data.data);
  }
});

// Обробники подій для відправки даних форм в alt:V client
function registerHandler(e) {
    e.preventDefault();
    const username = registerForm.elements[0].value;
    const email = registerForm.elements[1].value;
    const password = registerForm.elements[2].value;
    const confirmPassword = registerForm.elements[3].value;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    //Client resource to client resource
    console.log('Відправка даних реєстрації на сервер:', username, email, password);
    alt.emit('auth:registerData', username, email, password);
  }

function loginHandler(e) {
  e.preventDefault();
  const email = loginForm.elements[0].value;
  const password = loginForm.elements[1].value;
  const rememberMe = loginForm.elements[2].checked;
  console.log('Відправка даних входу на сервер:', email, password, rememberMe);
  alt.emit('auth:loginData', email, password, rememberMe);
}

function resetPasswordHandler(e) {
  e.preventDefault();
  const email = resetPasswordForm.elements[0].value;
  console.log('Відправка даних скидання пароля на сервер:', email);
  alt.emit('auth:resetPasswordData', email);
}
import * as alt from 'alt-client';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const resetPasswordForm = document.getElementById('reset-password-form');

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    alt.emitServer('auth:register', email, password);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    alt.emitServer('auth:login', email, password);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    alt.emitServer('auth:resetPassword', email);
  });
}
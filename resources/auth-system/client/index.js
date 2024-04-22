// client/index.js

import * as alt from 'alt-client';
import * as native from 'natives';

let authView = null;

function showLoginForm() {
  if (!authView) {
    authView = new alt.WebView("http://resource/ui/html/index.html");
    authView.on('load', () => {
      alt.log('WebView loaded successfully');
    });
    authView.on('error', (err) => {
      alt.log('WebView error:', err);
    });
    authView.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);
  }
}

function hideLoginForm() {
  if (authView) {
    authView.destroy();
    authView = null;
    alt.showCursor(false);
    alt.toggleGameControls(true);
  }
}

function showRegistrationForm() {
  // Код для показу форми реєстрації
  // ...
}

function showPasswordResetForm() {
  // Код для показу форми відновлення паролю
  // ...
}

alt.onServer('auth:loginSuccess', (token) => {
  // Збереження токена на клієнті (наприклад, у локальному сховищі)
  localStorage.setItem('token', token);

  hideLoginForm();
  // Додатковий код для виконання після успішного входу
});

alt.on('connectionComplete', () => {
  showLoginForm();
});

alt.on('auth:showLoginForm', showLoginForm);
alt.on('auth:showRegistrationForm', showRegistrationForm);
alt.on('auth:showPasswordResetForm', showPasswordResetForm);

// Інші обробники подій та логіка клієнтської частини
// ...
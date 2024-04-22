import * as alt from 'alt-client';
import * as native from 'natives';

let authView = null;

function showLoginForm(formType = 'login') {
  if (!authView) {
    authView = new alt.WebView("http://resource/ui/html/index.html");

    authView.on('load', () => {
      alt.log('WebView loaded successfully');
      authView.emit('auth:showForm', formType);
    });

    authView.on('error', (err) => {
      alt.log('WebView error:', err);
    });

    authView.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);
  } else {
    authView.emit('auth:showForm', formType);
    authView.focus();
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

alt.onServer('auth:loginSuccess', (token) => {
  localStorage.setItem('token', token);
  hideLoginForm();
  // Додатковий код для виконання після успішного входу
});

alt.on('connectionComplete', () => {
  showLoginForm();
});

alt.on('auth:showLoginForm', () => showLoginForm('login'));
alt.on('auth:showRegistrationForm', () => showLoginForm('register'));
alt.on('auth:showPasswordResetForm', () => showLoginForm('reset'));

alt.on('auth:registerData', (username, email, password) => {
  alt.emitServer('auth:register', username, email, password);
});

alt.on('auth:loginData', (email, password, rememberMe) => {
  alt.emitServer('auth:login', email, password, rememberMe);
});

alt.on('auth:resetPasswordData', (email) => {
  alt.emitServer('auth:resetPassword', email);
});
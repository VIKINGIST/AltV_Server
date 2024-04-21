import * as alt from 'alt-client';

alt.on('auth:register', (token) => {
  // Зберігання токена у локальному сховищі або куках
  localStorage.setItem('authToken', token);
  alt.log('Реєстрація успішна. Токен: ', token);
});

alt.on('auth:login', (token) => {
  // Зберігання токена у локальному сховищі або куках
  localStorage.setItem('authToken', token);
  alt.log('Вхід успішний. Токен: ', token);
});

// Відправка токена під час запитів до серверної частини
alt.onServer('secureRequest', () => {
  const token = localStorage.getItem('authToken');
  alt.emitServer('secureResponse', token);
});
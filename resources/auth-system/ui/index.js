import * as alt from 'alt-client';
import * as native from 'natives';

let browser;

alt.on('connectionComplete', () => {
  browser = new alt.WebView('http://resource/client/html/index.html');
  browser.on('update', () => {
    native.showCursorThisFrame();
  });
  browser.focus();
});
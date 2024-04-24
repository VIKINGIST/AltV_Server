import * as alt from 'alt-client';
import * as native from 'natives';

let browser;

alt.on('connectionComplete', () => {
  browser = new alt.WebView('http://resource/ui/html/index.html');
  browser.on('load', () => {
    native.showCursor(true);
    alt.toggleGameControls(false);
  });
  browser.focus();
});
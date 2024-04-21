// resources/commands/client/index.js
import alt from 'alt-client';

alt.onServer('commands:GetMarker', () => {
  const marker = alt.getWaypointPos();
  if (marker) {
    alt.log(`Відправлення координат мітки на сервер: ${JSON.stringify(marker)}`);
    alt.emitServer('commands:SetMarker', marker);
  } else {
    alt.log('Ви не встановили мітку на карті.');
  }
});

alt.onServer('commands:Notify', (message) => {
  alt.log(message);
});
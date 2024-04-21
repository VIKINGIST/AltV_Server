// resources/commands/server/index.js
import alt from 'alt-server';
import * as chat from 'alt:chat';

chat.registerCmd('tpm', (player, args) => {
  alt.log(`Команда /tpm викликана гравцем ${player.name}`);
  alt.emitClient(player, 'commands:GetMarker');
});

alt.onClient('commands:SetMarker', (player, markerPos) => {
  alt.log(`Отримано координати мітки від гравця ${player.name}: ${JSON.stringify(markerPos)}`);
  handleTeleportToMarker(player, markerPos);
});

function handleTeleportToMarker(player, markerPos) {
  if (!player.vehicle) {
    alt.log(`Координати гравця ${player.name} до телепортації: ${JSON.stringify(player.pos)}`);
    player.pos = markerPos;
    alt.log(`Координати гравця ${player.name} після телепортації: ${JSON.stringify(player.pos)}`);
    alt.emitClient(player, 'commands:Notify', 'Ви телепортувалися до мітки на карті.');
  } else {
    alt.emitClient(player, 'commands:Notify', 'Ви не можете телепортуватися, перебуваючи в транспортному засобі.');
  }
}
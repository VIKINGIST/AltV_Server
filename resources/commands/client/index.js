import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer('commands:GetMarker', () => {
    const marker = native.getFirstBlipInfoId(8); // 8 = Waypoint blip
    if (native.doesBlipExist(marker)) {
        const markerPos = native.getBlipInfoIdCoord(marker);
        alt.log(`Відправлення координат мітки на сервер: ${JSON.stringify(markerPos)}`);
        alt.emitServer('commands:SetMarker', markerPos);
    } else {
        alt.log('Ви не встановили мітку на карті.');
    }
});

alt.onServer('commands:Notify', (message) => {
    alt.log(message);
});
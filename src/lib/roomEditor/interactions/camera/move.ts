import * as PIXI from 'pixi.js';

import {IRoomEditorInteraction} from '..';

interface IMoveCameraAffixedData {
    cameraFromPos: {
        x: number,
        y: number
    },
    fromOffsetPos: {
        x: number,
        y: number
    }
}

const moveCameraOnWheelPress: IRoomEditorInteraction<IMoveCameraAffixedData> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent) {
        // Checks for a pressed mouse wheel, or Alt+Shift dragging, or Spacebar
        return e.button === 1 ||
            (e.altKey && e.shiftKey) ||
            this.riotEditor.spacebarMode;
    },
    listeners: {
        pointerdown(e: PIXI.FederatedPointerEvent, roomTag, affixedData) {
            affixedData.cameraFromPos = {
                x: this.camera.x,
                y: this.camera.y
            };
            affixedData.fromOffsetPos = {
                x: e.global.x,
                y: e.global.y
            };
        },
        globalpointermove(e: PIXI.FederatedPointerEvent, roomTag, affixedData) {
            const cfp = affixedData.cameraFromPos,
                  op = affixedData.fromOffsetPos;
            this.camera.x = cfp.x + (op.x - e.global.x) * this.camera.scale.x;
            this.camera.y = cfp.y + (op.y - e.global.y) * this.camera.scale.y;
            this.camera.updateTransform();
            this.cursor.update(e);
            this.tickBackgrounds();
        },
        pointerup: (e, roomTag, affixedData, callback) => {
            callback();
        }
    }
};
moveCameraOnWheelPress.listeners.pointerupoutside = moveCameraOnWheelPress.listeners.pointerup;

export {moveCameraOnWheelPress};

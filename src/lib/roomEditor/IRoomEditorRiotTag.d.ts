import {TileLayer} from './entityClasses/TileLayer';

import {ITilePatch} from './interactions/tiles/ITilePatch';
import {RoomEditor} from '.';

type tool = 'select' | 'addCopies' | 'addTiles' |
            'manageBackgrounds' | 'roomProperties' | 'uiTools';

export interface IRoomEditorRiotTag extends IRiotTag {
    tilePatch: ITilePatch;
    currentTileLayer: TileLayer;
    asset: IRoom;
    refs: {
        propertiesPanel?: IRiotTag & {
            updatePropList(): void;
            applyChanges(): void;
            update(): void;
        },
        tileEditor?: IRiotTag,
        backgroundsEditor?: IRiotTag,
        zoomLabel: HTMLSpanElement,
        uiTools?: IRiotTag,
        entriesList?: IRiotTag & {
            updateTileEntries(): void;
            resetLastSelected(): void;
        }
    };
    pixiEditor: RoomEditor;
    zoom: number;
    gridOn: boolean;
    freePlacementMode: boolean;
    controlMode: boolean;
    spacebarMode: boolean;
    currentTool: tool;
    currentTemplate: ITemplate | -1;
    setTool(tool: tool): () => void;
    changeSelectedTemplate(templateId: string): void;
}

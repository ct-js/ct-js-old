import {compile as civet} from '@danielx/civet';
import {civetOptions} from '../../exporter/scriptableProcessor';

import {uidMap} from '..';

export const convertCivetToJs = (): void => {
    const proj = window.currentProject;
    if (proj.language !== 'civet') {
        throw new Error('Project is already not in Civet');
    }
    const changeset = [];
    try {
        for (const [, asset] of uidMap) {
            if (['template', 'room', 'behavior'].includes(asset.type)) {
                for (const event of (asset as IScriptable).events) {
                    changeset.push({
                        event,
                        code: civet(event.code as string, civetOptions)
                    });
                }
            }
        }
        proj.language = 'typescript';
        for (const change of changeset) {
            change.event.code = change.code;
        }
        window.alertify.success('Done! 👏');
    } catch (err) {
        window.alertify.error('Could not convert to JavaScript. Operation rollbacked, everything is fine, but you need to fix your scripts.');
        window.alertify.error(err.stack);
    }
};

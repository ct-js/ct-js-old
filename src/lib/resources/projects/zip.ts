import path from 'path';
import fs from '../../neutralino-fs-extra';
const {os} = Neutralino;
import {getDirectories} from '../../platformUtils';
import {run} from '../../buntralino-client';

export const zipProject = async (): Promise<string> => {
    const savePromise = new Promise<void>((resolve) => {
        window.signals.one('projectSaved', () => {
            resolve();
        });
        window.signals.trigger('saveProject');
    });
    await savePromise;

    const {ct} = await getDirectories();
    const inDir = await fs.mkdtemp(path.join(await os.getPath('temp'), 'ctZipProject-')),
          outName = `${ct}/${sessionStorage.projname}.zip`;

    await fs.remove(outName);
    await fs.copy(window.projdir + '.ict', path.join(inDir, sessionStorage.projname));
    await fs.copy(window.projdir, path.join(inDir, sessionStorage.projname.slice(0, -4)));
    await run('zip', {
        dir: inDir,
        out: outName
    });
    // await fs.remove(inDir);

    return outName;
};

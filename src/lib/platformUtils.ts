import fs from './neutralino-fs-extra';
import {write} from './neutralino-storage';
import {getLanguageJSON} from './i18n';
import path from 'path';
const {os} = Neutralino;

export const isDev = () => NL_ARGS.includes('--neu-dev-auto-reload') || NL_ARGS.includes('--ctjs-devmode');
export const isWin = NL_OS === 'Windows';
export const isWindows = isWin;
export const isLinux = NL_OS === 'Linux';
export const isMac = NL_OS === 'Darwin';

/**
 * Checks whether a given directory is writable
 *
 * @param {String} way A path to check against
 * @returns {Promise<Boolean>} Resolves into either `true` (if writable) or `false`
 */
const checkWritable = async (way: string): Promise<boolean> => {
    try {
        // eslint-disable-next-line no-bitwise
        await fs.access(way, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Gets a directory ct.js can write to. It can be either a path where an executable is placed
 * or a ct.js folder in the home directory. Throws an error if no directory is available.
 * Outside of this module, it must be used only to check whether the current directory is writable.
 *
 * @returns {Promise<String>} A writable directory
 */
export const getWritableDir = async (): Promise<string> => {
    if (localStorage.customWritableDir) {
        if (!(await checkWritable(localStorage.customWritableDir))) {
            throw new Error(`Custom data folder ${localStorage.customWritableDir} is read-only`);
        }
        return localStorage.customWritableDir;
    }
    const path = require('path');

    const exec = path.dirname(NL_CWD);
    // The `HOME` variable is not always available in ct.js on Windows
    // eslint-disable-next-line no-process-env
    const home = await Neutralino.os.getPath('documents');

    const execWritable = checkWritable(exec);
    const homeWritable = checkWritable(home);
    await execWritable; // Run in parallel
    await homeWritable;
    // writing to an exec path on Mac is not a good idea,
    // as it will be hidden inside an app's directory, which is shown as one file.
    if (isMac && !(await homeWritable)) {
        throw new Error(`Could not write to folder ${home}. It is needed to create builds and run debugger. Check rights to these folders, and tweak sandbox settings if it is used.`);
    }
    // Home directory takes priority
    if (await homeWritable) {
        const ctFolder = path.join(home, 'ct.js');
        await fs.ensureDir(ctFolder);
        if (await checkWritable(ctFolder)) {
            return ctFolder;
        }
        throw new Error(`The ct.js folder ${ctFolder} is read-only, though its parent isn't. Check your access rights on this folder`);
    }
    if (!(await execWritable)) {
        throw new Error(`Could not write to folders ${home} and ${exec}. A folder is needed to create builds and run debugger. Check access rights to these folders, and tweak sandbox settings if it is used.`);
    }
    return exec;
};

export const requestWritableDir = async (): Promise<boolean> => {
    const voc = getLanguageJSON().writableFolderSelector;
    const folder = await os.showFolderDialog(voc.headerSelectFolderForData);
    try {
        const stats = await fs.getStats(folder);
        if (!stats.isDirectory) {
            window.alertify.error(voc.notADirectory);
            return false;
        }
        try {
            await fs.access(folder, fs.constants.W_OK);
            write('customWritableDir', folder);
            window.alertify.success(voc.complete);
            return true;
        } catch (e) {
            window.alertify.error(voc.folderNotWritable);
        }
    } catch (e) {
        window.alertify.error(voc.folderDoesNotExist);
    }
    return false;
};


type CtDirectories = {
    /** The main folder where user's content is written */
    ct: string;
    exports: string;
    builds: string;
    projects: string;
    gallery: string;
    catmods: string;
};
// We compute directories once and store it forever
let dirsPromise: Promise<CtDirectories> | null = null;
export const getDirectories = (): Promise<CtDirectories> => {
    if (dirsPromise) {
        return dirsPromise;
    }
    dirsPromise = (async (): Promise<CtDirectories> => {
        const ct = await getWritableDir();
        await fs.ensureDir(path.join(ct, 'Export'));
        await fs.ensureDir(path.join(ct, 'Builds'));
        await fs.ensureDir(path.join(ct, 'Projects'));
        return {
            ct,
            exports: path.join(ct, 'Export'),
            builds: path.join(ct, 'Builds'),
            projects: path.join(ct, 'Projects'),
            gallery: isDev() ? `${NL_CWD}/bundledAssets` : `${NL_CWD}/assets`,
            catmods: isDev() ? `${NL_CWD}/src/builtinCatmods` : `${NL_CWD}/catmods`
        };
    })();
    return dirsPromise;
};
export const getCatmodDirectory = (): string => (isDev() ? `${NL_CWD}/src/builtinCatmods` : `${NL_CWD}/catmods`);
export const getAssetDirectory = (): string => (isDev() ? `${NL_CWD}/bundledAssets` : `${NL_CWD}/assets`);

export const getTempDir = async (): Promise<{dir: string, remove: () => void}> => {
    const tempdir = await os.getPath('temp');
    const dir = await fs.mkdtemp(path.join(tempdir, 'ctjs-'));
    return {
        dir,
        remove() {
            return fs.remove(dir);
        }
    };
};

/** Opens a folder in the default OS file manager */
export const showFolder = (folder: string): void => {
    if (isWin) {
        os.execCommand(`start "" "${folder.replace(/\//g, '\\')}"`, {
            background: true
        });
    } else if (isMac) {
        os.execCommand(`open "${folder}"`, {
            background: true
        });
    } else {
        os.execCommand(`xdg-open "${folder}"`, {
            background: true
        });
    }
};
/** Opens a folder containing the given file in the default OS file manager */
export const showFile = (file: string): void => {
    const dirname = path.dirname(file);
    showFolder(dirname);
};

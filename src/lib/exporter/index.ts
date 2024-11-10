import fs from '../neutralino-fs-extra';
import path from 'path';

import {resetEventsCache, populateEventCache} from './scriptableProcessor';
import {ExporterError, highlightProblem} from './ExporterError';

import {ExportedMeta} from './_exporterContracts';

import {packImages} from './textures';
import {getSounds} from './sounds';
import {stringifyRooms, getStartingRoom} from './rooms';
import {stringifyStyles} from './styles';
import {stringifyTandems} from './emitterTandems';
import {stringifyTemplates} from './templates';
import {stringifyBehaviors} from './behaviors';
import {stringifyContent} from './content';
import {bundleFonts, bakeBitmapFonts} from './fonts';
import {getAssetTree} from './assetTree';
import {bakeFavicons} from './icons';
import {getUnwrappedExtends, getCleanKey} from './utils';
import {compileEnums} from './enums';
import {revHash} from './../utils/revHash';
import {substituteHtmlVars} from './html';
import {stringifyScripts, getStartupScripts} from './scripts';
import {transform as typeScript} from 'sucrase';

import {getByTypes} from '../resources';
import {getVariantPath} from '../resources/sounds/common';
import {getLanguageJSON} from './../i18n';
import {getDirectories} from './../platformUtils';

import {run} from '../buntralino-client';


let currentProject: IProject;
let dirs: Awaited<ReturnType<typeof getDirectories>>;

const ifMatcher = (varName: string, symbol = '@') => new RegExp(`/\\*\\!? ?if +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*)(?:/\\*\\!? ?else +${symbol}${varName}${symbol} ?\\*/([\\s\\S]*?))?/\\*\\!? ?endif +${symbol}${varName}${symbol} ?\\*/`, 'g');
const varMatcher = (varName: string, symbol = '@') => new RegExp(`/\\*\\!? ?${symbol}${varName}${symbol} ?\\*/`, 'g');

/**
 * A little home-brewn string templating function for JS and CSS.
 * Can't really add an example of its usage, as it is based on js comments
 * and they won't fit in the JSDoc comments ¯\_(ツ)_/¯
 * See ct.release files for examples.
 *
 * Supports if/else blocks. Empty arrays are treated as `false`.
 *
 * @param input The source string with template tags
 * @param vars The variables to substitute
 * @param injections Module-provided injections to substitute
 */
const template = (
    input: string,
    vars: Record<string, unknown>,
    injections: Record<string, string> = {}
) => {
    let output = input;
    for (const i in vars) {
        // .replace(stuff, () => string) prevents pattern substitution, notably
        // it doesn't break syntax around this.text = '$'
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
        output = output.replace(varMatcher(i), () => (typeof vars[i] === 'object' ? JSON.stringify(vars[i]) : String(vars[i])));
        output = output.replace(ifMatcher(i), (Array.isArray(vars[i]) ? (vars[i] as unknown[]).length : vars[i]) ? '$1' : '$2');
    }
    for (const i in injections) {
        output = output.replace(varMatcher(i, '%'), () => (typeof injections[i] === 'object' ? JSON.stringify(injections[i]) : injections[i]));
    }
    return output;
};

const getSubstitution = (value: unknown): unknown => {
    if (!value) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value;
};
const parseKeys = function (catmod: ICatmodManifest, str: string, lib: string) {
    var str2 = str;
    if (catmod.fields) {
        const {fields} = catmod,
              values = getUnwrappedExtends(currentProject.libs[lib] || {});

        for (const field of fields) {
            if (!field.key) {
                // Skip invalid/decorative fields
                continue;
            }
            const cleanKey = getCleanKey(field.key);
            const val = values[cleanKey];
            if (field.type === 'checkbox' && !val) {
                str2 = str2.replace(RegExp('(/\\*)?%' + cleanKey + '%(\\*/)?', 'g'), 'false');
            } else {
                str2 = str2.replace(RegExp('(/\\*)?%' + cleanKey + '%(\\*/)?', 'g'), () => String(getSubstitution(val)));
            }
        }
    }
    return str2;
};

const removeBrokenModules = async function removeBrokenModules(project: IProject) {
    await Promise.all(Object.keys(project.libs).map(async key => {
        const moduleJSONPath = path.join(dirs.catmods, key, 'module.json');
        if (!(await fs.pathExists(moduleJSONPath))) {
            const message = `Removing an absent catmod ${key} from the project.`;
            window.alertify.log(message);
            // eslint-disable-next-line no-console
            console.warn(message);
            delete project.libs[key];
        }
    }));
};

const addModules = async () => { // async
    const pieces = await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const moduleJSONPath = path.join(dirs.catmods, lib, 'module.json');
        const moduleJSON = await fs.readJSON(moduleJSONPath, {
            encoding: 'utf8'
        });
        if (await fs.pathExists(path.join(dirs.catmods, lib, 'index.js'))) {
            return parseKeys(moduleJSON, await fs.readFile(path.join(dirs.catmods, lib, 'index.js'), {
                encoding: 'utf8'
            }), lib);
        }
        return false;
    }));
    return pieces.filter(t => t).join('\n');
};

const enum Injections {
    load,
    start,
    switch,
    onbeforecreate,
    oncreate,
    ondestroy,
    beforedraw,
    beforestep,
    afterdraw,
    afterstep,
    beforeframe,
    beforeroomoncreate,
    roomoncreate,
    roomonleave,
    afterroomdraw,
    beforeroomdraw,
    beforeroomstep,
    afterroomstep,
    css,
    res,
    resload,
    templates,
    rooms,
    styles,
    htmltop,
    htmlbottom
}
type InjectionName = keyof typeof Injections;

const getInjections = async () => {
    const injections: Record<InjectionName, string> = {
        load: '',
        start: '',
        switch: '',

        onbeforecreate: '',
        oncreate: '',
        ondestroy: '',

        beforedraw: '',
        beforestep: '',
        afterdraw: '',
        afterstep: '',

        beforeframe: '',
        beforeroomoncreate: '',
        roomoncreate: '',
        roomonleave: '',
        afterroomdraw: '',
        beforeroomdraw: '',
        beforeroomstep: '',
        afterroomstep: '',

        css: '',
        res: '',
        resload: '',
        templates: '',
        rooms: '',
        styles: '',
        htmltop: '',
        htmlbottom: ''
    };
    await Promise.all(Object.keys(currentProject.libs).map(async lib => {
        const libDir = path.join(dirs.catmods, lib);
        const libData = await fs.readJSON(path.join(libDir, 'module.json'), {
            encoding: 'utf8'
        });
        if (await fs.pathExists(path.join(libDir, 'injections'))) {
            const injectFiles: string[] = await fs.readdir(path.join(libDir, 'injections')),
                  injectKeys = injectFiles.map(fname => path.basename(fname, path.extname(fname)));
            await Promise.all(injectKeys.map(async (key: InjectionName, ind) => {
                if (key in injections) {
                    const injection = await fs.readFile(path.join(libDir, 'injections', injectFiles[ind]), {
                        encoding: 'utf8'
                    });
                    // false positive??
                    // eslint-disable-next-line require-atomic-updates
                    injections[key] += parseKeys(libData, injection, lib);
                }
            }));
        }
    }));
    return injections;
};

type ExporterFlags = {
    production: boolean;
    desktop: boolean;
    debug: boolean;
}

// eslint-disable-next-line max-lines-per-function, complexity
const exportCtProject = async (
    project: IProject,
    projdir: string,
    flags:Partial<ExporterFlags> = {}
): Promise<string> => {
    flags = Object.assign({
        production: false,
        desktop: false,
        debug: true
    }, flags);

    const {desktop, debug} = flags as Required<ExporterFlags>;
    let {production} = flags as Required<ExporterFlags>;
    if (localStorage.forceProductionForDebug === 'yes') {
        production = true;
    }

    window.signals.trigger('exportProject');
    currentProject = project;
    dirs = await getDirectories();

    const {settings} = project;
    const assets = getByTypes();
    await removeBrokenModules(project);
    resetEventsCache();

    const noMinify = settings.export.codeModifier === 'none';

    if (assets.room.length < 1) {
        throw new Error(getLanguageJSON().common.noRooms);
    }

    const preserveItems: string[] = [];
    // Preserve texture atlas data if textures were not changed
    if (sessionStorage.canSkipTextureGeneration === 'yes') {
        preserveItems.push('img');
    }
    if (!preserveItems.length || production) {
        await fs.remove(dirs.exports);
    } else {
        const items = await fs.readdir(dirs.exports);
        const removalOps = items
            .filter(item => !preserveItems.includes(item))
            .map(item => fs.remove(path.join(dirs.exports, item)));
        await Promise.all(removalOps);
    }
    await fs.ensureDir(dirs.exports + '/img');
    await fs.ensureDir(dirs.exports + '/snd');

    const injections = await getInjections();
    let cssBundleFilename = 'ct.css',
        jsBundleFilename = 'ct.js';

    const startroom = getStartingRoom(project);

    /* Load source files in parallel */
    const sources: Record<'pixi.js' | 'ct.js' | 'ct.css' | 'index.html', Promise<string>> = {} as never;
    const sourcesList = [
        'pixi.js',
        'ct.js',
        'ct.css',
        'index.html',
        'desktopPack/game/neutralino.js',
        'debugger.js'
    ];
    for (const file of sourcesList) {
        sources[file as keyof typeof sources] = fetch(`data/ct.release/${file}`).then(response => response.text());
    }
    /* assets — run in parallel */
    const texturesTask = packImages(assets.texture, dirs.exports, production);
    const bitmapFontsTask = bakeBitmapFonts(assets.typeface, projdir, dirs.exports);
    const favicons = bakeFavicons(project, dirs.exports, production);
    const modulesTask = addModules();
    /* Run event cache population in parallel as well */
    const cacheHandle = populateEventCache(project);

    let actionsSetup = '';
    for (const action of project.actions) {
        actionsSetup += `inputs.addAction('${action.name}', ${JSON.stringify(action.methods)});\n`;
    }
    const projectmeta: ExportedMeta = {
        name: settings.authoring.title,
        author: settings.authoring.author,
        site: settings.authoring.site,
        version: settings.authoring.version.join('.') + settings.authoring.versionPostfix
    };

    // Process all the scriptables to get combined code for the root rooms
    await cacheHandle;
    const typefaces = await bundleFonts(assets.typeface, projdir, dirs.exports);
    const rooms = stringifyRooms(assets, project);
    const templates = stringifyTemplates(assets, project);
    const behaviors = stringifyBehaviors(assets.behavior, project);
    const rootRoomOnCreate = rooms.rootRoomOnCreate + '\n' + templates.rootRoomOnCreate;
    const rootRoomOnStep = rooms.rootRoomOnStep + '\n' + templates.rootRoomOnStep;
    const rootRoomOnDraw = rooms.rootRoomOnDraw + '\n' + templates.rootRoomOnDraw;
    const rootRoomOnLeave = rooms.rootRoomOnLeave + '\n' + templates.rootRoomOnLeave;

    const soundCopyPromises = [];
    for (const sound of assets.sound) {
        for (const variant of sound.variants) {
            const source = getVariantPath(sound, variant);
            const ext = path.extname(source);
            soundCopyPromises.push(fs.copy(source, path.join(dirs.exports, '/snd/', `${variant.uid}${ext}`)));
        }
    }

    /* User-defined scripts */
    let userScripts = '';
    for (const script of project.scripts) {
        try {
            userScripts += typeScript(script.code, {
                transforms: ['typescript']
            }).code + ';\n';
        } catch (e) {
            const errorMessage = `${e.name || 'An error'} occured while compiling a custom script ${script.name}`;
            const exporterError = new ExporterError(errorMessage, {
                problematicCode: highlightProblem(script.code, e.location || e.loc),
                clue: 'syntax'
            }, e);
            throw exporterError;
        }
    }

    let buffer = template(await sources['ct.js'], {
        projectmeta,
        ctversion: ctjsVersion,
        contentTypes: stringifyContent(project),

        pixelatedrender: Boolean(settings.rendering.pixelatedrender),
        highDensity: Boolean(settings.rendering.highDensity),
        maxfps: Number(settings.rendering.maxFPS),
        transparent: Boolean(settings.rendering.transparent),

        showErrors: settings.export.showErrors,
        reportLink: JSON.stringify(settings.export.errorsLink || ''),

        startroom: startroom.name,
        startwidth: startroom.width,
        startheight: startroom.height,
        viewMode: settings.rendering.viewMode,
        autocloseDesktop: settings.export.autocloseDesktop,
        globalVars: project.globalVars?.length ? `let ${project.globalVars.join(', ')};` : '',

        atlases: (await texturesTask).atlases,
        tiledImages: (await texturesTask).tiledImages,
        sounds: getSounds(assets.sound),
        assetTree: settings.export.bundleAssetTree &&
            JSON.stringify(getAssetTree(project.assets, project)),

        actions: actionsSetup,
        rooms: rooms.libCode,
        rootRoomOnCreate,
        rootRoomOnStep,
        rootRoomOnDraw,
        rootRoomOnLeave,
        behaviorsTemplates: behaviors.templates,
        behaviorsRooms: behaviors.rooms,
        templates: templates.libCode,
        enums: compileEnums(production),
        styles: stringifyStyles(assets.style),
        tandemTemplates: stringifyTandems(assets.tandem),
        fonts: typefaces.js,
        bitmapFonts: await bitmapFontsTask,

        userScripts,
        scriptAssets: stringifyScripts(assets.script),
        startupScripts: getStartupScripts(assets.script),
        catmods: await modulesTask,

        production,
        neutralino: desktop,
        debug
    }, injections);


    /* passthrough copy of files in the `include` folder */
    if (await fs.pathExists(projdir + '/include/')) {
        await fs.copy(projdir + '/include/', dirs.exports);
    }
    await Promise.all(Object.keys(project.libs).map(async lib => {
        if (await fs.pathExists(path.join(dirs.catmods, lib, 'includes'))) {
            await fs.copy(path.join(dirs.catmods, lib, 'includes'), dirs.exports);
        }
    }));
    await fs.writeFile(path.join(dirs.exports, 'pixi.js'), await sources['pixi.js'], 'utf8');

    /* CSS styles for rendering settings and branding */
    let preloaderColor1 = project.settings.branding.accent,
        preloaderColor2 = (window.brehautColor(preloaderColor1).getLuminance() < 0.5) ? '#ffffff' : '#000000';
    if (project.settings.branding.invertPreloaderScheme) {
        [preloaderColor1, preloaderColor2] = [preloaderColor2, preloaderColor1];
    }
    let css = template(await sources['ct.css'], {
        pixelatedrender: project.settings.rendering.pixelatedrender,
        hidecursor: project.settings.rendering.hideCursor,
        hidemadewithctjs: project.settings.branding.hideLoadingLogo,
        preloaderforeground: preloaderColor1,
        preloaderbackground: preloaderColor2,
        fonts: typefaces.css,
        accent: project.settings.branding.accent
    }, injections);
    if (!noMinify) {
        css = await run('minifyCss', css) as string;
    }

    // Various JS protection measures
    // JS minify
    if (production && currentProject.settings.export.codeModifier === 'minify') {
        buffer = await (await require('terser').minify(buffer, {
            mangle: {},
            format: {
                comments: '/^! Made with ct.js /'
            }
        })).code;
    }
    // JS obfuscator
    if (production && currentProject.settings.export.codeModifier === 'obfuscate') {
        buffer = require('javascript-obfuscator')
            .obfuscate(buffer)
            .getObfuscatedCode();
    }
    /*
    // Wrap in a self-calling function
    if (production && currentProject.settings.export.functionWrap) {
        buffer = `(function() {\n${buffer}\n})();`;
    }
    */

    // Calculate hashes to prevent caching for changed files
    if (production) {
        const jsHash = revHash(buffer);
        const cssHash = revHash(css);
        jsBundleFilename = `ct.${await jsHash}.js`;
        cssBundleFilename = `ct.${await cssHash}.css`;
    }

    if (debug) {
        buffer = (await sources['desktopPack/game/neutralino.js' as keyof typeof sources]) +
                 (await sources['debugger.js' as keyof typeof sources]) +
                 '\n' + buffer;
    }

    // Output HTML, JS and CSS files
    const iconRevision = await favicons;
    let html = substituteHtmlVars(
        await sources['index.html'],
        project,
        desktop,
        injections, {
            cssBundle: cssBundleFilename,
            jsBundle: jsBundleFilename,
            iconRevision
        }
    );
    if (!noMinify) {
        html = await run('minifyHtml', html) as string;
    }
    await Promise.all([
        fs.writeFile(path.join(dirs.exports, '/index.html'), html, 'utf8'),
        fs.writeFile(path.join(dirs.exports, cssBundleFilename), css, 'utf8'),
        fs.writeFile(path.join(dirs.exports, jsBundleFilename), buffer, 'utf8'),
        Promise.all(soundCopyPromises)
    ]);
    return path.join(dirs.exports, '/index.html');
};

export {exportCtProject};

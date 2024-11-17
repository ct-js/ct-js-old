import * as buntralino from './buntralino';

// Available commands:
import convertPngToIco from './lib/png2icons';
import fetchJson from './lib/fetchJson';
import fetchText from './lib/fetchText';
import serve, {stopServer} from './lib/serve';
import zip from './lib/zip';
import unzip from './lib/unzip';
import packForDesktop from './lib/packForDesktop';
import ttf2woff from './lib/ttf2woff';
import getNetInterfaces from './lib/getNetInterfaces';
import minifyCss from './lib/minifyCss';
import minifyHtml from './lib/minifyHtml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functionMap: Record<string, (payload: any) => Promise<any>> = {
    convertPngToIco,
    fetchJson,
    fetchText,
    serve,
    stopServer,
    zip,
    unzip,
    packForDesktop,
    ttf2woff,
    getNetInterfaces,
    minifyCss,
    minifyHtml,

    debugBootstrap: async (opts: {
        link: string,
        dpr: number
    }) => {
        let gamePosition: Awaited<ReturnType<typeof buntralino.getPosition>>,
            gameSize: Awaited<ReturnType<typeof buntralino.getSize>>;
        await Promise.all([
            buntralino.create(opts.link, {
                name: 'game',
                injectClientLibrary: true
            })
            .then(() => Promise.all([
                buntralino.getPosition('game'),
                buntralino.getSize('game')
            ]))
            .then(([position, size]) => {
                [gamePosition, gameSize] = [position, size];
            }),

            buntralino.create('/gameTools.html', {
                name: 'debugToolbar',
                hidden: true
            })
        ]);

        const toolbarWidth = 440 * opts.dpr,
              toolbarHeight = 50 * opts.dpr;
        const x = gamePosition!.x + gameSize!.width! / 2 - toolbarWidth / 2,
              {y} = gamePosition!;
        buntralino.setSize('debugToolbar', {
            width: toolbarWidth,
            height: toolbarHeight
        });
        buntralino.move('debugToolbar', x, y);
        buntralino.show('debugToolbar');
    },
    debugReloadGame: () => buntralino.reload('game'),
    debugExit: () => {
        buntralino.exit('game');
        buntralino.exit('debugToolbar');
        buntralino.sendEvent('ide', 'debugFinished');
        return Promise.resolve();
    },
    debugToggleQrs: async () => {
        if (buntralino.isConnectionOpen('qrs')) {
            await buntralino.exit('qrs');
        } else {
            const [pos, size] = await Promise.all([
                buntralino.getPosition('debugToolbar'),
                buntralino.getSize('debugToolbar')
            ]);
            await buntralino.create('/gameToolsQrs.html', {
                name: 'qrs',
                width: 600,
                height: 800,
                x: pos!.x + size.width! / 2 - 300,
                y: pos!.y + size.height! + 10
            });
        }
    },
    debugFocusGame: () => buntralino.focus('game')
};

buntralino.registerMethodMap(functionMap);

await buntralino.create('/', {
    name: 'ide'
});

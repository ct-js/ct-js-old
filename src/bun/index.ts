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
    minifyHtml
};

buntralino.registerMethodMap(functionMap);

await buntralino.create('/', {
    name: 'ide'
});
await buntralino.create('/', {
    name: 'ide2'
});

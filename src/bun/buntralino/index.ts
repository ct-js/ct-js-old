import {callMethod} from './methodLibrary';
import {spawnNeutralino} from './spawnNeutralino';
import * as neuWindow from './window';
import {getUid} from './utils';
import type {Connection} from './connections';
// eslint-disable-next-line no-duplicate-imports
import {dropConnection, registerConnection, getConnectionByToken, connections} from './connections';
import {evalsMap} from './evals';

export {
    registerMethod,
    registerMethodMap
} from './methodLibrary';
export * from './window';

interface WindowOptions {
    name?: string;
    useSavedState?: boolean;
    [key: string]: unknown
}

const awaitedNames = new Set<string>();

// This websocket server is used by Neutralino to run commands in Bun.
const receiver = Bun.serve({
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        // eslint-disable-next-line consistent-return
        return new Response('Upgrade failed', {
            status: 500
        });
    },
    websocket: {
        // this is called when a message is received
        async message(ws, message) {
            const payload = JSON.parse(message as string);
            if (payload.command === 'announceSelf') {
                if (!payload.NL_PORT || !payload.NL_TOKEN || !payload.name) {
                    throw new Error('🥟 Invalid payload for announceSelf: ', payload);
                }
                if (!awaitedNames.has(payload.name)) {
                    throw new Error('🥟 Attempt to announce a window we didn\'t create! Fishy!');
                }
                const wsToken = payload.NL_TOKEN.split('.').pop();
                const wsHref = `ws://localhost:${payload.NL_PORT}?connectToken=${wsToken}`;
                const ws = new WebSocket(wsHref);
                const connection: Connection = {
                    ws,
                    port: parseInt(payload.NL_PORT, 10),
                    neuToken: payload.NL_TOKEN,
                    bunToken: getUid(),
                    name: payload.name
                };
                ws.onopen = () => {
                    registerConnection(payload.name, connection);
                    neuWindow.sendEvent(connection, 'buntralinoRegisterParent', {
                        token: connection.bunToken,
                        port: receiver.port
                    });
                    console.log(`🥟 Registered ${payload.name} window 💅`);
                };
                return;
            }
            const connection = getConnectionByToken(payload.token);
            if (!connection) {
                ws.send(JSON.stringify({
                    error: 'Invalid token'
                }));
                return;
            }
            if (payload.command === 'run') {
                try {
                    neuWindow.sendEvent(connection, 'buntralinoExecResult', {
                        id: payload.id,
                        // eslint-disable-next-line no-await-in-loop
                        returnValue: await callMethod(payload.method, payload.payload)
                    });
                } catch (error) {
                    neuWindow.sendEvent(connection, 'buntralinoExecResult', {
                        id: payload.id,
                        error: (error as Error).message ?? null,
                        stack: (error as Error).stack ?? null
                    });
                }
            } else if (payload.command === 'shutdown') {
                connections.forEach(connection =>
                    neuWindow.sendNeuMethod(connection, 'app.exit', {}));
                // eslint-disable-next-line no-process-exit
                process.exit(0);
            } else if (payload.command === 'evalResult') {
                const [resolve, reject] = evalsMap.get(payload.id)!;
                if (payload.error) {
                    const err = new Error('🥟🐞 evalJs failed for ' + connection.name + ': ' + payload.error +
                        '\n\nClient-side stack trace:\n' + payload.stack);
                    reject(err);
                } else {
                    resolve(payload.returnValue);
                }
                evalsMap.delete(payload.id);
            }
        }
    }
});

console.log('🥟👂 Bun server listening on port ', receiver.port);

const normalizeArgument = (arg: any) => {
    if (typeof arg !== 'string') {
        return arg;
    }
    arg = arg.trim();
    if (arg.includes(' ')) {
        arg = `"${arg}"`;
    }
    return arg;
};

export const create = async (url: string, options = {} as WindowOptions): Promise<string> => {
    const id = String(Math.random()
        .toString(36)
        .slice(2, 9));
    const name = options.name ?? id;
    awaitedNames.add(name);

    options = {
        useSavedState: false,
        ...options
    };
    const args = [];
    for (const key in options) {
        if (key === 'processArgs') {
            continue;
        }
        const cliKey: string = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        args.push(`--window-${cliKey}=${normalizeArgument(options[key])}`);
    }

    const proc = await spawnNeutralino([
        '--buntralino-port=' + receiver.port,
        '--buntralino-name=' + name,
        `--url=${url}`,
        ...args
    ]);
    proc.exited.then(() => {
        console.log('🥟🪦 Neutralino process exited with code', proc.exitCode);
        dropConnection(name);
    });

    return id;
};

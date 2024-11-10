import {callMethod} from './methodLibrary';
import {spawnNeutralino} from './spawnNeutralino';
import * as neuWindow from './window';
import {getUid} from './utils';
import type {Connection} from './connections';
// eslint-disable-next-line no-duplicate-imports
import {dropConnection, registerConnection, getConnectionByToken, connections} from './connections';

export {
    registerMethod,
    registerMethodMap
} from './methodLibrary';
export * from './window';

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
                
            }
        }
    }
});

interface WindowOptions {
    name?: string;
    useSavedState?: boolean;
    [key: string]: unknown
}


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
        '--buntralino-hook=' + id,
        `--url=${url}`,
        ...args
    ]);
    proc.exited.then(() => {
        console.log('Neutralino process exited with code', proc.exitCode);
        dropConnection(name);
    });
    for await (const chunk of proc.readable) {
        const line = chunk.toString('utf8').trim();
        console.log('received', line, chunk);
        if (!line.startsWith('⚛️')) {
            continue;
        }
        // Turn a line into an object
        const response = line.split(';').reduce((acc, val) => {
            const [key, value] = val.split('=');
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
        if (response.id === id && response.port && response.token) {
            const ws = new WebSocket(`ws://localhost:${response.port}`);
            const connection: Connection = {
                ws,
                process: proc,
                port: parseInt(response.port, 10),
                neuToken: response.token,
                bunToken: getUid()
            };
            registerConnection(name, connection);
            neuWindow.sendEvent(connection, 'buntralinoRegisterParent', {
                token: connection.bunToken,
                port: receiver.port
            });
            break;
        }
    }

    return id;
};

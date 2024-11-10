import {getUid} from './utils';
import type {Connection} from './connections';
// eslint-disable-next-line no-duplicate-imports
import {getConnectionByName} from './connections';
import {evalsMap, type PromiseRejectCallback, type PromiseResolveCallback} from './evals';

const ensureConnection = (target: Connection | string): Connection => {
    if (typeof target === 'string') {
        const result = getConnectionByName(target);
        if (!result) {
            throw new Error(`No connection found by name: ${target}`);
        }
        return result;
    }
    return target;
};

export const sendNeuMethod = (connection: Connection, method: string, payload?: unknown) => {
    const id = getUid();
    connection.ws.send(JSON.stringify({
        id,
        method,
        // eslint-disable-next-line id-blacklist
        data: payload,
        accessToken: connection.neuToken
    }));
    return new Promise((resolve, reject) => {
        const listener = (e: MessageEvent<any>): any => {
            const message = JSON.parse(e.data);
            if (message.id === id) {
                connection.ws.removeEventListener('message', listener);
                if (message.error) {
                    reject(new Error(message.error));
                }
                resolve(message.data.returnValue ?? message.data);
            }
        };
        connection.ws.addEventListener('message', listener);
    });
};
export const sendEvent = (connection: Connection, event: string, payload: unknown) => {
    sendNeuMethod(connection, 'events.broadcast', {
        event,
        // eslint-disable-next-line id-blacklist
        data: payload
    });
};

export const exit = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'app.exit', {});
export const show = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.show', {});
export const hide = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.hide', {});
export const getPosition = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.getPosition') as Promise<Neutralino.window.WindowPosOptions>;
export const getSize = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.getSize') as Promise<Neutralino.window.WindowSizeOptions>;
export const setAlwaysOnTop = (target: Connection | string, onTop: boolean) => sendNeuMethod(ensureConnection(target), 'window.setAlwaysOnTop', {
    onTop
});
export const setSize = async (
    target: Connection | string,
    options: Neutralino.window.WindowOptions
) => {
    target = ensureConnection(target);
    const sizeOptions = await getSize(target);
    options = {
        ...sizeOptions,
        ...options // merge prioritizing options arg
    };
    sendNeuMethod(target, 'window.setSize', options);
};
export const move = (target: Connection | string, x: number, y: number) => sendNeuMethod(ensureConnection(target), 'window.move', {
    x,
    y
});
export const setPosition = move;
export const center = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.center');
export const focus = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.focus');
export const getTitle = (target: Connection | string) => sendNeuMethod(ensureConnection(target), 'window.getTitle') as Promise<string>;
export const setTitle = (target: Connection | string, title: string) => sendNeuMethod(ensureConnection(target), 'window.setTitle', {
    title
});

export const evalJs = (target: Connection | string, js: string) => {
    const requestId = getUid();
    sendEvent(ensureConnection(target), 'buntralinoEval', {
        js,
        requestId
    });
    let evalResolve: PromiseResolveCallback,
        evalReject: PromiseRejectCallback;
    const promise = new Promise<void>((resolve, reject) => {
        evalResolve = resolve;
        evalReject = reject;
        evalsMap.set(requestId, [evalResolve, evalReject]);
    });
    return promise;
};
export const navigate = (target: Connection | string, url: string) => sendEvent(ensureConnection(target), 'buntralinoNavigate', {
    url
});

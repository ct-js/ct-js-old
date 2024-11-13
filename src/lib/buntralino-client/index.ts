import listeners from './listeners';

const getUid = () => Date.now().toString(36) + Math.random().toString(36);

let bunToken: string, bunPort: number, bunWs: WebSocket;
let readyResolve: (value: void | PromiseLike<void>) => void,
    readyReject: (reason?: Error) => void;
const readyPromise = new Promise<void>((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
});

(async () => {
    const Neutralino = window.Neutralino ?? await import('@neutralinojs/lib');
    Neutralino.events.on('ready', () => {
        try {
            const match1 = window.NL_ARGS.find(a => a.startsWith('--buntralino-port=')),
                  match2 = window.NL_ARGS.find(a => a.startsWith('--buntralino-name='));
            if (!match1 || !match2) {
                return;
            }
            const [, port] = match1.split('=');
            const [, name] = match2.split('=');
            const neuToken = NL_TOKEN || sessionStorage.NL_TOKEN;
            bunWs = new WebSocket(`ws://localhost:${port}`);
            bunWs.onopen = () => {
                // eslint-disable-next-line no-console
                console.debug('⚛️ Announcing ourself to Buntralino…');
                bunWs.send(JSON.stringify({
                    command: 'announceSelf',
                    name,
                    NL_PORT,
                    NL_TOKEN: neuToken
                }));
            };

            const listener = (payload: {
                detail: {
                    token: string,
                    port: number
                }
            }) => {
                Neutralino.events.off('buntralinoRegisterParent', listener);
                if (!payload.detail.token || !payload.detail.port) {
                    return;
                }
                bunToken = payload.detail.token;
                bunPort = payload.detail.port;
                bunWs = new WebSocket(`ws://localhost:${bunPort}`);
                bunWs.onopen = () => {
                    listeners(bunToken, bunWs);
                    // eslint-disable-next-line no-console
                    console.log('⚛️🥟 Buntralino connected on port', bunPort);
                    readyResolve();
                };
            };
            Neutralino.events.on('buntralinoRegisterParent', listener);
        } catch (error) {
            readyReject(error);
            console.error('⚛️ Buntralino failed with', error);
        }
    });
})();

export const run = async (methodName: string, payload?: unknown): Promise<unknown> => {
    await readyPromise;
    const awaitedResponseId = getUid();
    bunWs.send(JSON.stringify({
        token: bunToken,
        command: 'run',
        method: methodName,
        id: awaitedResponseId,
        payload
    }));
    return new Promise<unknown>((resolve, reject) => {
        const listener = (event: CustomEvent<{
            id: string,
            returnValue?: unknown,
            error?: string | null,
            stack?: string | null
        }>) => {
            const {id, returnValue, error, stack} = event.detail;
            if (id === awaitedResponseId) {
                Neutralino.events.off('buntralinoExecResult', listener);
                if ('error' in event.detail) {
                    reject(new Error(error ?? 'Unknown error', {
                        cause: stack ? new Error(stack) : null
                    }));
                }
                resolve(returnValue);
            }
        };
        Neutralino.events.on('buntralinoExecResult', listener);
    });
};
export const shutdown = () => {
    bunWs.send(JSON.stringify({
        token: bunToken,
        command: 'shutdown'
    }));
};

/**
 * Sends an event with additional event.detail value to all the Neutralino instances
 */
export const broadcast = (eventName: string, payload: unknown) => {
    bunWs.send(JSON.stringify({
        token: bunToken,
        command: 'broadcast',
        event: eventName,
        payload
    }));
};
/**
 * Sends an event to a specific named Neutralino instance.
 */
export const sendEvent = (target: string, eventName: string, payload?: unknown) => {
    bunWs.send(JSON.stringify({
        token: bunToken,
        command: 'sendEvent',
        event: eventName,
        target,
        payload
    }));
};

export const ready = readyPromise;

export default {
    run,
    ready
};

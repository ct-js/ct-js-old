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
            const match = window.NL_ARGS.find(a => a.startsWith('--buntralino-hook='));
            if (!match) {
                return;
            }
            const [, id] = match.split('=');
            const neuToken = NL_TOKEN || sessionStorage.NL_TOKEN;
            Neutralino.app.writeProcessOutput(`⚛️;id=${id};port=${NL_PORT};token=${neuToken};⚛️\n`);

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
                readyResolve();
                // eslint-disable-next-line no-console
                console.log('⚛️🥟 Buntralino connected');
            };
            Neutralino.events.on('buntralinoRegisterParent', listener);
        } catch (error) {
            readyReject(error);
            console.error('⚛️🥟 Buntralino failed with', error);
        }
    });
})();

export const run = async (methodName: string, payload: unknown): Promise<unknown> => {
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
export const ready = readyPromise;

export default {
    run,
    ready
};

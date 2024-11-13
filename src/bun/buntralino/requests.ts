import {connections, getConnectionByName, type Connection} from './connections';
import {evalsMap} from './evals';
import {callMethod} from './methodLibrary';
import * as neuWindow from './window';

export default async function fulfillRequests(payload: any, connection: Connection) {
    switch (payload.command) {
    case 'run':
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
            console.error(`Error running method "${payload.method}" for ${connection.name}:`);
            console.error(error);
        }
        break;
    case 'shutdown':
        connections.forEach(connection => neuWindow.sendNeuMethod(connection, 'app.exit', {}));
            // eslint-disable-next-line no-process-exit
        process.exit(0);
        break;
    case 'evalResult': {
        const [resolve, reject] = evalsMap.get(payload.id)!;
        if (payload.error) {
            const err = new Error('🥟🐞 evalJs failed for ' + connection.name + ': ' + payload.error +
                    '\n\nClient-side stack trace:\n' + payload.stack);
            reject(err);
        } else {
            resolve(payload.returnValue);
        }
        evalsMap.delete(payload.id);
    } break;
    case 'broadcast': {
        const {event, detail} = payload;
        connections.forEach(connection => {
            neuWindow.sendEvent(connection, event, detail);
        });
    } break;
    case 'sendEvent': {
        const {event, target, detail} = payload;
        const connection = getConnectionByName(target);
        if (connection) {
            neuWindow.sendEvent(connection, event, detail);
        }
    } break;
    default:
        console.error('🥟🙄 Invalid command received: ', payload.command);
    }
}

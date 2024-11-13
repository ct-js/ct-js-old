export type Connection = {
    ws: WebSocket,
    port: number,
    neuToken: string,
    bunToken: string,
    name: string
};

import type {PromiseResolveCallback} from './evals';

const awaitedConnections = new Map<string, Set<PromiseResolveCallback>>();

export const connections = new Map<string, Connection>();
export const dropConnection = (name: string) => {
    connections.delete(name);
};
export const awaitConnection = (name: string) =>
    new Promise<void>(resolve => {
        if (!awaitedConnections.has(name)) {
            awaitedConnections.set(name, new Set([resolve]));
        } else {
            awaitedConnections.get(name)!.add(resolve);
        }
    });
export const registerConnection = (name: string, connection: Connection) => {
    connections.set(name, connection);
    if (awaitedConnections.has(name)) {
        const resolvers = awaitedConnections.get(name)!;
        for (const resolve of resolvers) {
            resolve();
        }
        awaitedConnections.delete(name);
    }
};
export const getConnectionByToken = (token: string): Connection | undefined => {
    for (const [, connection] of connections) {
        if (connection.bunToken === token) {
            return connection;
        }
    }
    return void 0;
};
export const getConnectionByName = (name: string): Connection | undefined => connections.get(name);
export const isConnectionOpen = (name: string): boolean => connections.has(name);

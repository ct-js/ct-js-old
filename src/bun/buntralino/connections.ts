export type Connection = {
    ws: WebSocket,
    port: number,
    neuToken: string,
    bunToken: string,
    name: string
};

export const connections = new Map<string, Connection>();
export const dropConnection = (name: string) => {
    connections.delete(name);
};
export const registerConnection = (name: string, connection: Connection) => {
    connections.set(name, connection);
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

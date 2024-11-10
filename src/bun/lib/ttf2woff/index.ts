import type {ttf2WoffOptions} from './messagingContract';

import ttf2woff from 'ttf2woff';

export default async (payload: ttf2WoffOptions): Promise<void> => {
    const ttf = await Bun.file(payload.in).arrayBuffer();
    const uint = new Uint8Array(ttf);
    const woff = ttf2woff(uint);
    Bun.write(payload.out, woff.buffer);
};

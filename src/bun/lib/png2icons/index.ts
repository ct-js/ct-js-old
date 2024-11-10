import type {png2IconsOptions} from './messagingContract';

import {BILINEAR, HERMITE, createICO} from '@ctjs/png2icons';

export default async (param: png2IconsOptions): Promise<void> => {
    const interpolation = param.pixelart ? BILINEAR : HERMITE;
    const pngFile = param.pngPath === '/data/img/notexture.png' ?
        Bun.file('./bgServices/defaultIcon.png') : // paths in Bun.file are relative to CWD
        Bun.file(param.pngPath);
    const icoBuffer = createICO(
        Buffer.from(await pngFile.arrayBuffer()),
        interpolation,
        0,
        true
    )!;
    await Bun.write(param.icoPath, icoBuffer.buffer);
};

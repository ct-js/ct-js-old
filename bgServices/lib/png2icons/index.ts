import type {png2IconsOptions} from './messagingContract';

import png2icons from 'png2icons';

export default async (param: png2IconsOptions): Promise<void> => {
    const interpolation = param.pixelart ? png2icons.BILINEAR : png2icons.HERMITE;
    const pngFile = Bun.file(param.pngPath);
    const icoBuffer = png2icons.createICO(
        Buffer.from(await pngFile.arrayBuffer()),
        interpolation,
        0,
        true
    )!;
    await Bun.write(param.icoPath, icoBuffer);
};
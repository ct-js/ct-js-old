import {run} from 'src/lib/buntralino-client';
import {getTextureOrig} from 'src/lib/resources/textures';
import {showFolder, getDirectories} from 'src/lib/platformUtils';
import {getStartingRoom} from '../rooms';

export const exportForDesktop = async (project: IProject, inputDir: string) => {
    const startingRoom = getStartingRoom(project);
    const outputDir = await run('packForDesktop', {
        authoring: project.settings.authoring,
        desktopMode: project.settings.rendering.desktopMode,
        iconPath: getTextureOrig(project.settings.branding.icon, true),
        inputDir,
        outputDir: (await getDirectories()).builds,
        startingHeight: startingRoom.height,
        startingWidth: startingRoom.width,
        versionPostfix: project.settings.authoring.versionPostfix || '',
        pixelartIcon: project.settings.rendering.pixelatedrender &&
            !project.settings.branding.forceSmoothIcons
    }) as string;
    showFolder(outputDir);
};

const neutralinoBinaries = [{
    platform: 'linux',
    arch: 'arm64',
    neutralinoPostfix: 'linux_arm64'
}, {
    platform: 'linux',
    arch: 'x64',
    neutralinoPostfix: 'linux_x64'
}, {
    platform: 'macos',
    arch: 'arm64',
    neutralinoPostfix: 'mac_arm64'
}, {
    platform: 'macos',
    arch: 'x64',
    neutralinoPostfix: 'mac_x64'
}, {
    platform: 'win32',
    arch: 'x64',
    neutralinoPostfix: 'win_x64.exe'
}];
export const spawnNeutralino = async (args: string[]) => {
    const config = {
        stdin: 'pipe' as const,
        stdout: 'pipe' as const,
        stderr: 'pipe' as const,
        cwd: process.cwd()
    };
    const bundledPath = `${process.cwd()}/neutralino${process.platform === 'win32' ? '.exe' : ''}`,
          bundled = Bun.file(bundledPath);
    if (await bundled.exists()) {
        // Use the bundled binary if it exists
        return Bun.spawn([bundledPath, ...args], config);
    }
    const match = neutralinoBinaries.find(binary =>
        binary.platform === process.platform &&
        binary.arch === process.arch);
    if (!match) {
        throw new Error(`Unsupported platform or architecture: ${process.platform} ${process.arch}`);
    }
    // eslint-disable-next-line no-console
    console.log('🥟⚛️ Running Neutralino in dev mode 🚧');
    // Use the downloaded binary created by `neu install`
    return Bun.spawn([
        `${process.cwd()}/bin/neutralino-${match.neutralinoPostfix}`,
        '--load-dir-res',
        '--path=.',
        '--neu-dev-extension',
        '--neu-dev-auto-reload',
        '--window-enable-inspector=true',
        ...args
    ], config);
};

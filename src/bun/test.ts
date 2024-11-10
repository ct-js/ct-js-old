console.log(process.cwd());

const proc = Bun.spawn({
    cmd: ['C:\\Users\\Comigo\\ct-js\\bin\\neutralino-win_x64.exe', '--window-enable-inspector=true'],
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
});

for await (const chunk of proc.readable) {
    console.log('received1 ', chunk);
}
for await (const chunk of proc.readable) {
    console.log('received2 ', chunk);
}
for await (const chunk of proc.readable) {
    console.log('received3 ', chunk);
}

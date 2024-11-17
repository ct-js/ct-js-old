game-tools.flexrow.aButtonGroup(class="{opts.class}")
    #theDragger
        svg.feather(onclick="{hello}")
            use(xlink:href="#dragger-vertical")
    .debugger-toolbar-aDivider
    .debugger-toolbar-aButton(onclick="{sendEventToGame('debugToggleFullscreen')}" title="{gameFullscreen? voc.exitFullscreen : voc.enterFullscreen}")
        svg.feather
            use(xlink:href="#{gameFullscreen? 'minimize' : 'maximize'}-2")
    .debugger-toolbar-aButton(onclick="{sendEventToGame('debugScreenshot')}" title="{voc.screenshot}")
        svg.feather
            use(xlink:href="#camera")
    .debugger-toolbar-aButton(onclick="{requestOpenExternal}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="#external-link")
    .debugger-toolbar-aButton(onclick="{!awaitingQr && toggleQrCodes}" title="{voc.openExternal}")
        svg.feather
            use(xlink:href="#qr-code")
    .debugger-toolbar-aDivider
    .debugger-toolbar-aButton(onclick="{sendEventToGame('debugTogglePause')}" title="{gamePaused? voc.resume : voc.pause}")
        svg.feather
            use(xlink:href="#{gamePaused? 'play' : 'pause'}")
    .debugger-toolbar-aButton(onclick="{sendEventToGame('debugRestartRoom')}" title="{voc.restartRoom}")
        svg.feather
            use(xlink:href="#room-reload")
    .debugger-toolbar-aButton(onclick="{sendEventToGame('debugRestartGame')}" title="{voc.restartGame}")
        svg.feather
            use(xlink:href="#rotate-cw")
    .debugger-toolbar-aDivider
    .debugger-toolbar-aButton.error(onclick="{requestStopDebugging}" title="{voc.stopGame}")
        svg.feather
            use(xlink:href="#x-octagon")
    script.
        this.namespace = 'debuggerToolbar';
        this.mixin(require('src/lib/riotMixins/voc').default);

        const {isDev} = require('src/lib/platformUtils');
        const {run, sendEvent, focus} = require('src/lib/buntralino-client');

        this.gameFullscreen = false;
        this.gamePaused = false;
        this.sendEventToGame = action => () => {
            sendEvent('game', action);
            run('debugFocusGame');
        };
        this.requestOpenExternal = () => {
            sendEvent('ide', 'debugOpenExternal')
        };
        this.requestStopDebugging = () => {
            run('debugExit');
        };

        // used to prevent double-clicking when async actions are still executing
        this.awaitingQr = false;

        let myWidth = 440;
        Neutralino.window.getSize()
        .then(size => {
            myWidth = size.width;
        });

        this.toggleQrCodes = async () => {
            this.awaitingQr = true;
            this.update();
            await run('debugToggleQrs');
            this.awaitingQr = false;
            this.update();
        };

        Neutralino.events.on('debugPaused', e => {
            this.gamePaused = true;
            this.update();
        });
        Neutralino.events.on('debugUnpaused', e => {
            this.gamePaused = false;
            this.update();
        });
        Neutralino.events.on('debugFullscreen', e => {
            this.gameFullscreen = true;
            this.update();
        });
        Neutralino.events.on('debugExitFullscreen', e => {
            this.gameFullscreen = false;
            this.update();
        });

        this.on('mount', () => {
            setTimeout(() => {
                Neutralino.window.setDraggableRegion('theDragger', {
                    alwaysCapture: true
                });
            }, 0);
        });

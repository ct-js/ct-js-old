app-view.flexcol
    nav.nogrow.flexrow(if="{window.currentProject}" ref="mainNav")
        ul.aNav.tabs.nogrow
            li.limitwidth(onclick="{changeTab('menu')}" title="{voc.ctIDE}" class="{active: tab === 'menu'}" ref="mainMenuButton")
                svg.feather.nmr
                    use(xlink:href="#menu")
            li.limitwidth(onclick="{changeTab('patrons')}" title="{voc.patrons}" class="{active: tab === 'patrons'}")
                svg.feather
                    use(xlink:href="#heart")
            li.limitwidth(onclick="{saveProject}" title="{vocGlob.save} (Control+S)" data-hotkey="Control+s")
                svg.feather
                    use(xlink:href="#save")
            li.nbl.nogrow.noshrink(onclick="{tryRunProject}" title="{voc.launch} {voc.launchHotkeys}" data-hotkey="F5")
                svg.feather.rotateccw(show="{exportingProject}")
                    use(xlink:href="#refresh-ccw")
                svg.feather(hide="{exportingProject}")
                    use(xlink:href="#play")
                span(if="{!debugging}") {voc.launch}
                span(if="{debugging}") {voc.restart}
            li.nogrow.noshrink(onclick="{changeTab('project')}" class="{active: tab === 'project'}" data-hotkey="Control+1" title="Control+1" ref="projectTab")
                svg.feather
                    use(xlink:href="#sliders")
                span {voc.project}
            li.nogrow.noshrink(onclick="{changeTab('assets')}" class="{active: tab === 'assets'}" data-hotkey="Control+2" title="Control+2" ref="projectTab")
                svg.feather
                    use(xlink:href="#folder")
                span {voc.assets}
            .aTabsWrapper(
                onwheel="{scrollHorizontally}"
                class="{shadowleft: scrollableLeft, shadowright: scrollableRight}"
            )
                ul.aNav.flexrow.xscroll(ref="tabswrap")
                    li.nogrow(
                        each="{asset, ind in openedAssets}"
                        class="{active: asset === tab}"
                        onclick="{changeTab(asset)}"
                        onauxclick="{closeAsset}"
                        data-hotkey="{ind < 8 ? 'Control+' + (ind + 3) : ''}"
                        ref="openedTabs"
                    )
                        svg.feather
                            use(xlink:href="#{iconMap[asset.type]}")
                        span {asset.name}
                        .app-view-anUnsavedIcon(if="{tabsDirty[ind]}" onclick="{closeAsset}")
                            svg.feather.anActionableIcon.warning
                                use(xlink:href="#circle")
                            svg.feather.anActionableIcon
                                use(xlink:href="#x")
                        svg.feather.anActionableIcon(if="{!tabsDirty[ind]}" onclick="{closeAsset}")
                            use(xlink:href="#x")
            search-and-recents.nogrow
    div.flexitem.relative(if="{window.currentProject}")
        main-menu(show="{tab === 'menu'}" ref="mainMenu")
        debugger-screen-multiwindow(if="{tab === 'debug' && !splitDebugger}" params="{debugParams}" data-hotkey-scope="play" ref="debugger")
        debugger-screen-split(if="{tab === 'debug' && splitDebugger}" params="{debugParams}" data-hotkey-scope="play" ref="debugger")
        project-settings(show="{tab === 'project'}" data-hotkey-scope="project" ref="projectsSettings")
        patrons-screen(if="{tab === 'patrons'}" ref="patrons" data-hotkey-scope="patrons")
        asset-browser.pad.aView#theAssetBrowser(
            show="{tab === 'assets'}"
            ref="assets"
            data-hotkey-scope="assets"
            namespace="projectBrowser"
            click="{rerouteOpenAsset2}"
        )
            yield(to="filterArea")
                // Riot sorcery: `this` points to the asset-browser, not app-view
                create-asset-menu(
                    inline="yup" square="ye"
                    collection="{currentCollection}"
                    folder="{currentFolder}"
                    onimported="{parent.rerouteOpenAsset}"
                )
        // Asset editors
        .aView(
            each="{asset in openedAssets}"
            data-is="{editorMap[asset.type]}"
            show="{asset === tab}"
            asset="{asset}"
            ondone="{closeAssetRequest}"
            ref="openedEditors"
            isactiveeditor="{asset === tab}"
        )
    exporter-error(if="{exporterError}" error="{exporterError}" onclose="{closeExportError}")
    new-project-onboarding(if="{sessionStorage.showOnboarding && localStorage.showOnboarding !== 'off'}")
    notepad-panel(ref="notepadPanel" show="{tab !== 'debug'}")
    asset-confirm(
        discard="{assetDiscard}"
        cancel="{assetCancel}"
        apply="{assetApply}"
        asset="{confirmationAsset}"
        if="{showAssetConfirmation}"
    )
    dnd-processor(if="{window.currentProject}" currentfolder="{refs.assets.currentFolder}")
    .aDimmer.fixed.pad(if="{showPrelaunchSave}")
        button.aDimmer-aCloseButton(onclick="{cancelLaunch}")
            svg.feather
                use(href="#x")
        .aModal.pad.npb.flexfix.app-view-anAssetConfirmDialog
            .flexfix-header
                h2.nmt {voc.applyAssetsQuestion}
                p {voc.applyAssetsExplanation}
            .flexfix-body
                p.nmt {voc.unsavedAssets}
                ul.aStripedList
                    li(each="{asset, ind in openedAssets}" if="{tabsDirty[ind]}")
                        svg.feather
                            use(xlink:href="#{iconMap[asset.type]}")
                        span  {asset.name}
            .inset.flexrow.flexfix-footer
                button.nogrow(onclick="{cancelLaunch}")
                    svg.feather
                        use(href="#undo")
                    span {vocGlob.goBack}
                .aSpacer
                button.nogrow(onclick="{launchNoApply}")
                    svg.feather
                        use(href="#play")
                    span {voc.runWithoutApplying}
                .aSpacer
                button.nogrow.success(ref="applyAndRun" onclick="{applyAndLaunch}")
                    svg.feather
                        use(href="#check")
                    span {voc.applyAndRun}
    script.
        const fs = require('src/lib/neutralino-fs-extra');
        const {write} = require('src/lib/neutralino-storage');
        const {saveProject, getProjectCodename} = require('src/lib/resources/projects');
        const resources = require('src/lib/resources');
        const {isDev} = require('src/lib/platformUtils');
        const {run} = require('src/lib/buntralino-client');
        const {getDirectories} = require('src/lib/platformUtils');
        const {init, createWindow, sendMessage, awaitConnection, shareConnections, getPosition, getSize, setPosition, show, focus, broadcastTo} = require('src/lib/multiwindow');
        const {exportCtProject} = require('src/lib/exporter');
        this.editorMap = resources.editorMap;
        this.iconMap = resources.resourceToIconMap;

        this.namespace = 'appView';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.tab = 'assets'; // A tab can be either a string ('project', 'assets', etc.) or an asset object
        window.hotkeys.cleanScope();
        window.hotkeys.push('assets');
        this.openedAssets = [];
        this.tabsDirty = [];
        const webglUsers = ['style', 'tandem', 'room'];
        const canAddWebglEditor = (newAsset) => {
            if (!webglUsers.includes(newAsset.type)) {
                return true;
            }
            let i = 0;
            for (const asset of this.openedAssets) {
                if (webglUsers.includes(asset.type)) {
                    i++;
                }
            }
            if (i >= 14) {
                return false;
            }
            return true;
        };
        this.refreshDirty = () => {
            const tabs = this.refs.openedEditors || [];
            this.tabsDirty = (Array.isArray(tabs) ? tabs : [tabs])
                .map(riotTab => riotTab.isDirty());
        };
        this.changeTab = tab => () => {
            this.tab = tab;
            this.refreshDirty();
            window.hotkeys.cleanScope();
            window.signals.trigger('globalTabChanged', tab);
            if (typeof tab === 'string') {
                // The current tab is a predefined panel
                window.signals.trigger(`${tab}Focus`);
                window.hotkeys.push(tab);
            } else {
                // The current tab is an asset
                if (['room', 'template', 'behavior', 'script'].includes(tab.type)) {
                    window.orders.trigger('forceCodeEditorLayout');
                }
                window.hotkeys.push(tab.uid);
            }
        };

        window.signals.on('assetChanged', this.refreshDirty);
        this.on('unmount', () => {
            window.signals.off('assetChanged', this.refreshDirty);
        });
        const checkDeletedTabs = id => {
            if (typeof this.tab !== 'string' && this.tab.uid === id) {
                this.tab = 'assets';
            }
            this.openedAssets = this.openedAssets.filter(t => t.uid !== id);
            this.update();
        };
        window.signals.on('assetRemoved', checkDeletedTabs);
        this.on('unmount', () => {
            window.signals.off('assetRemoved', checkDeletedTabs);
        });

        this.recentAssets = localStorage[`recentlyOpened_${getProjectCodename()}`] ?
            JSON.parse(localStorage[`recentlyOpened_${getProjectCodename()}`]) :
            [];
        this.openAsset = (asset, noOpen) => () => {
            // Check whether the asset is not yet opened
            if (!this.openedAssets.includes(asset)) {
                // Check whether we technically can add a new editor
                if (!canAddWebglEditor(asset)) {
                    window.alertify.error(this.voc.cantAddEditor);
                    return;
                }
                // Try putting the asset next to the already opened one
                const pos = this.openedAssets.indexOf(this.tab);
                if (pos !== -1) {
                    this.openedAssets.splice(pos + 1, 0, asset);
                } else {
                    this.openedAssets.push(asset);
                }
                const newPos = this.openedAssets.indexOf(asset);
                setTimeout(() => {
                    const tabs = Array.isArray(this.refs.openedTabs) ?
                        this.refs.openedTabs :
                        [this.refs.openedTabs];
                    tabs[newPos].scrollIntoView();
                }, 100);
            } else if (noOpen) {
                // eslint-disable-next-line no-console
                console.warn('[app-view] An already opened asset was called with noOpen. ' +
                'This is probably a bug as you either do open assets or create them elsewhere without opening.');
            }
            if (!noOpen) {
                // Remember recently opened assets for the global asset search
                if (this.recentAssets.indexOf(asset.uid) !== -1) {
                    this.recentAssets.splice(this.recentAssets.indexOf(asset.uid), 1);
                }
                this.recentAssets.unshift(asset.uid);
                this.recentAssets = this.recentAssets.filter(a => resources.exists(null, a));
                if (this.recentAssets.length > 10) {
                    this.recentAssets.length = 10;
                }
                write(`recentlyOpened_${getProjectCodename()}`, this.recentAssets);

                this.changeTab(asset)();
            }
        };
        this.rerouteOpenAsset = asset => {
            this.openAsset(asset)();
            this.update();
        };
        this.rerouteOpenAsset2 = asset => () => {
            this.openAsset(asset)();
            this.update();
        };
        const assetOpenOrder = asset => {
            if (typeof asset === 'string') {
                if (asset.split('/').length === 2) {
                    asset = resources.getById(null, asset.split('/')[1]);
                } else {
                    asset = resources.getById(null, asset);
                }
            }
            this.openAsset(asset)();
            this.update();
        };
        const assetsOpenOrder = assets => {
            if (typeof assets[0] === 'string') {
                assets = assets.map(asset => resources.getById(null, asset));
            }
            for (const asset of assets) {
                this.openAsset(asset)();
            }
            this.update();
        };
        const actionsOpener = () => {
            this.changeTab('project')();
            this.update();
            this.refs.projectsSettings.openTab('actions')();
            this.refs.projectsSettings.update();
        };
        window.orders.on('openAsset', assetOpenOrder);
        window.orders.on('openAssets', assetsOpenOrder);
        window.orders.on('openActions', actionsOpener);
        this.on('unmount', () => {
            window.orders.off('openAsset', assetOpenOrder);
            window.orders.off('openAssets', assetsOpenOrder);
            window.orders.off('openActions', actionsOpener);
        });
        this.closeAsset = e => {
            e.stopPropagation();
            e.preventDefault();
            this.update();
            this.refreshDirty();
            const {asset, ind} = e.item;
            const editors = Array.isArray(this.refs.openedEditors) ?
                this.refs.openedEditors :
                [this.refs.openedEditors];
            const editor = editors[ind];
            if (editor.isDirty()) {
                this.showAssetConfirmation = true;
                this.confirmationAsset = asset;
            } else {
                this.openedAssets.splice(ind, 1);
                if (this.tab === asset) {
                    this.changeTab('assets')();
                }
            }
        };
        this.closeAssetRequest = asset => {
            const ind = this.openedAssets.findIndex(a => a.uid === asset.uid);
            this.openedAssets.splice(ind, 1);
            if (typeof this.tab !== 'string' && this.tab.uid === asset.uid) {
                this.changeTab('assets')();
            }
            this.update();
        };
        this.assetDiscard = () => {
            const ind = this.openedAssets.findIndex(a => a.uid === this.confirmationAsset.uid);
            this.openedAssets.splice(ind, 1);
            this.showAssetConfirmation = false;
            if (typeof this.tab !== 'string' && this.tab.uid === this.confirmationAsset.uid) {
                this.changeTab('assets')();
            }
            this.confirmationAsset = void 0;
            this.update();
        };
        this.assetCancel = () => {
            this.showAssetConfirmation = false;
            this.confirmationAsset = void 0;
            this.update();
        };
        this.assetApply = async () => {
            const ind = this.openedAssets.findIndex(a => a.uid === this.confirmationAsset.uid);
            const editors = Array.isArray(this.refs.openedEditors) ?
                this.refs.openedEditors :
                [this.refs.openedEditors];
            const editor = editors[ind];
            const response = await editor.saveAsset();
            if (response === false) {
                return; // Editors can return `false` explicitly to tell that the editor
                        // cannot be closed right now.
            }
            this.openedAssets.splice(this.openedAssets.indexOf(this.confirmationAsset), 1);
            if (typeof this.tab !== 'string' && this.tab.uid === this.confirmationAsset.uid) {
                this.changeTab('assets')();
            }
            this.showAssetConfirmation = false;
            this.confirmationAsset = void 0;
            this.update();
        };

        // Remember assets opened before closing the editor and load them on project load.
        const saveOpenedAssets = () => {
            const openedIds = this.openedAssets.map(a => a.uid);
            write(`lastOpened_${getProjectCodename()}`, openedIds);
        };
        const loadOpenedAssets = () => {
            let openedIds = [];
            try {
                openedIds = JSON.parse(localStorage[`lastOpened_${getProjectCodename()}`]);
            } catch (e) {
                void e;
            }
            if (!openedIds.length) {
                return;
            }
            window.alertify.log(this.voc.loadingPreviouslyOpened);
            for (let i = 0; i < openedIds.length; i++) {
                const id = openedIds[i];
                if (resources.exists(null, id)) {
                    this.openAsset(resources.getById(null, id), i !== openedIds.length - 1)();
                }
            }
        };
        this.on('mount', () => {
            loadOpenedAssets();
        });

        this.saveProject = async () => {
            saveOpenedAssets();
            try {
                this.refreshDirty();
                await this.applyAssets();
                await saveProject();
                this.saveRecoveryDebounce();
                alertify.success(this.vocGlob.savedMessage, 'success', 3000);
                window.signals.trigger('projectSaved');
            } catch (e) {
                alertify.error(e);
            }
        };
        this.saveRecovery = () => {
            if (window.currentProject) {
                const YAML = require('js-yaml');
                const recoveryYAML = YAML.dump(window.currentProject);
                fs.outputFile(window.projdir + '.ict.recovery', recoveryYAML);
            }
            this.saveRecoveryDebounce();
        };
        this.saveRecoveryDebounce = window.debounce(this.saveRecovery, 1000 * 60 * 5);
        window.signals.on('saveProject', this.saveProject);
        this.on('unmount', () => {
            window.signals.off('saveProject', this.saveProject);
        });
        this.saveRecoveryDebounce();

        // Options when there are unapplied assets but a user triggers a launch
        this.showPrelaunchSave = false;
        this.launchNoApply = () => {
            this.showPrelaunchSave = false;
            this.runProject();
        };
        this.cancelLaunch = () => {
            this.showPrelaunchSave = false;
        };
        this.applyAssets = async () => {
            for (let i = 0; i < this.tabsDirty.length; i++) {
                if (!this.tabsDirty[i]) {
                    continue;
                }
                // A fallback for when there is only one [ref="openedEditors"] ⬇️
                const editor = this.refs.openedEditors[i] ?? this.refs.openedEditors;
                // eslint-disable-next-line no-await-in-loop
                await editor.saveAsset();
            }
            this.update();
        };
        this.applyAndLaunch = async () => {
            await this.applyAssets();
            this.showPrelaunchSave = false;
            this.runProject();
        };

        /**
         * Checks for any editors in dirty (unsaved) state;
         * if something is, shows a save dialog, otherwise — runs the project immediately.
         */
        this.tryRunProject = () => {
            if (this.exportingProject) {
                // Do nothing if the exporter is already running
                return;
            }
            this.refreshDirty();
            if (this.tabsDirty.some(a => a)) {
                if (localStorage.autoapplyOnLaunch === 'on') {
                    this.applyAndLaunch();
                } else {
                    this.showPrelaunchSave = true;
                    this.update();
                    this.refs.applyAndRun.focus();
                }
            } else {
                this.runProject();
            }
        };

        let debugServer;
        this.on('mount', async () => {
            const {exports} = await getDirectories();
            debugServer = await run('serve', {
                dir: exports,
                port: 40469
            });
        });
        this.on('unmount', () => {
            if (debugServer) {
                run('stopServer', debugServer.port);
            }
        });

        let debugToolbarSpawned = false;
        init('ide');
        this.runProject = async () => {
            if (this.exportingProject) {
                return;
            }
            document.body.style.cursor = 'progress';
            this.exportingProject = true;
            this.update();
            this.exporterError = void 0;
            try {
                await exportCtProject(window.currentProject, window.projdir, {
                    debug: true
                });
                if (localStorage.disableBuiltInDebugger === 'yes') {
                    // Open in default browser
                    const {os} = Neutralino;
                    os.open(debugServer.url);
                } else if (this.debugging) {
                    // Restart the game as we already have the tab opened
                    broadcastTo('game', 'reloadGame');
                } else {
                    this.debugging = true;
                    debugToolbarSpawned = false;
                    const debuggerWidth = 440;
                    await Promise.all([
                        createWindow('game', '/debugBridge.html', {
                            title: `${window.currentProject.settings.authoring.title || 'Untitled ct.js game'} (debug)`,
                            enableInspector: true,
                            hidden: true,
                            processArgs: '--enable-extensions=false'
                        }, {
                            url: debugServer.url
                        }),
                        createWindow('debugToolbar', '/gameTools.html', {
                            title: this.vocGlob.debugTools,
                            enableInspector: isDev(),
                            borderless: true,
                            maximizable: false,
                            hidden: true,
                            width: debuggerWidth,
                            height: 40,
                            minWidth: debuggerWidth,
                            minHeight: 40,
                            maxWidth: debuggerWidth,
                            maxHeight: 40,
                            alwaysOnTop: true,
                            processArgs: `--enable-extensions=false ${isDev() ? '--ctjs-devmode' : ''} --gameport=${debugServer.port}`
                        })
                    ]);
                    shareConnections('game', ['debugToolbar']);
                    shareConnections('debugToolbar', ['game']);
                    const [position, size] = await Promise.all([
                        getPosition('game'),
                        getSize('game')
                    ]);
                    setPosition(
                        'debugToolbar',
                        position.x + size.width / 2 - debuggerWidth / 2,
                        position.y + 10
                    );
                    await show('debugToolbar');
                    focus('game');
                }
            } catch(e) {
                this.exporterError = e;
                console.error(e);
            } finally {
                document.body.style.cursor = '';
                this.exportingProject = false;
                this.update();
            }
        };
        const openExternalListener = () => {
            const {os} = Neutralino;
            os.open(debugServer.url);
        };
        const stopDebuggingListener = () => {
            sendMessage('game', 'app.exit');
            sendMessage('debugToolbar', 'app.exit');
            this.debugging = false;
            this.update();
        };
        const netInterfacesListener = async () => {
            const [interfaces] = await Promise.all([
                run('getNetInterfaces'),
                awaitConnection('qrCodes')
            ]);
            broadcastTo('qrCodes', 'netConnections', interfaces);
        };
        Neutralino.events.on('openDebugExternal', openExternalListener);
        Neutralino.events.on('stopDebugging', stopDebuggingListener);
        Neutralino.events.on('getConnections', netInterfacesListener);
        this.on('unmount', () => {
            Neutralino.events.off('openDebugExternal', openExternalListener);
            Neutralino.events.off('stopDebugging', stopDebuggingListener);
            Neutralino.events.off('getConnections', netInterfacesListener);
        });

        this.runProjectAlt = async () => {
            if (this.exportingProject) {
                return;
            }
            document.body.style.cursor = 'progress';
            this.exportingProject = true;
            this.exporterError = void 0;
            try {
                await exportCtProject(window.currentProject, window.projdir, {
                    debug: false
                });
                // Open in default browser
                const {os} = Neutralino;
                os.open(debugServer.url);
            } catch (e) {
                this.exporterError = e;
                console.error(e);
            } finally {
                document.body.style.cursor = '';
                this.exportingProject = false;
                this.update();
            };
        };
        window.hotkeys.on('Alt+F5', this.runProjectAlt);
        this.on('unmount', () => {
            window.hotkeys.off('Alt+F5', this.runProjectAlt);
        });
        this.closeExportError = () => {
            this.exporterError = void 0;
            this.update();
        };

        this.scrollHorizontally = e => {
            const {tabswrap} = this.refs;
            // Have to cache scrollLeft as smooth scrolling creates a lag in read operations
            const newScrollLeft = tabswrap.scrollLeft + e.deltaY;
            tabswrap.scrollLeft = newScrollLeft;
            this.updateScrollShadows(newScrollLeft);
        };
        this.updateScrollShadows = val => {
            const {tabswrap} = this.refs;
            val = val ?? tabswrap.scrollLeft;
            this.scrollableLeft = val > 0;
            this.scrollableRight = val < tabswrap.scrollWidth - tabswrap.clientWidth;
        };

        const {clipboardToCanvas, toArrayBuffer} = require('src/lib/utils/imageUtils');
        // Paste handler for pasting textures
        this.tryPasteAssets = async () => {
            if (!window.hotkeys.inScope('assets')) {
                return;
            }
            // Try to load a texture
            const {clipboard} = Neutralino;
            const format = await clipboard.getFormat();
            if (format !== 'image') {
                alertify.error(this.vocGlob.couldNotLoadFromClipboard);
                return;
            }
            const image = await clipboard.readImage();
            const canvas = clipboardToCanvas(image);
            const imageBuffer = toArrayBuffer(canvas);

            const {createAsset} = require('src/lib/resources');
            await createAsset('texture', this.refs.assets.currentFolder, {
                src: imageBuffer
            });

            alertify.success(this.vocGlob.pastedFromClipboard);
            this.refs.assets.update();
        };
        window.hotkeys.on('Control+v', this.tryPasteAssets);
        this.on('unmount', () => {
            window.hotkeys.off('Control+v', this.tryPasteAssets);
        });

        this.toggleFullscreen = async () => {
            const {window} = Neutralino;
            window.setFullscreen(!(await window.isFullScreen()));
        };
        window.hotkeys.on('F11', this.toggleFullscreen);
        this.on('unmount', () => {
            window.hotkeys.off('F11', this.toggleFullscreen);
        });

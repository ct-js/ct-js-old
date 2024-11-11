main-menu-project
    h1 {voc.heading}
    ul.aMenu
        li(onclick="{saveProject}")
            svg.feather
                use(xlink:href="#save")
            span {vocGlob.save}
        li(onclick="{zipProject}")
            svg.feather
                use(xlink:href="#package")
            span {voc.zipProject}
        li(onclick="{openIncludeFolder}")
            .aSpacer
            span {voc.openIncludeFolder}
    ul.aMenu
        li(onclick="{openProject}")
            svg.feather
                use(xlink:href="#folder")
            span {voc.openProject}
        li(onclick="{openExample}")
            .aSpacer
            span {voc.openExample}
        li(onclick="{startNewWindow}")
            .aSpacer
            span {voc.startNewWindow}
        li(onclick="{toStartScreen}")
            .aSpacer
            span {voc.startScreen}
    ul.aMenu(if="{window.currentProject.language === 'civet'}")
        li(onclick="{convertToJs}")
            svg.icon
                use(xlink:href="#javascript")
            span {voc.convertToJs}
    script.
        const {os} = Neutralino;
        const {isDev} = require('src/lib/platformUtils');

        this.namespace = 'mainMenu.project';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.saveProject = () => {
            window.signals.trigger('saveProject');
        };

        this.openIncludeFolder = () => {
            const fs = require('src/lib/neutralino-fs-extra'),
                  path = require('path');
            fs.ensureDir(path.join(window.projdir, '/include'))
            .then(() => {
                const {showFolder} = require('src/lib/platformUtils');
                showFolder(path.join(window.projdir, '/include'));
            });
        };

        this.zipProject = async () => {
            const {zipProject} = require('src/lib/resources/projects/zip');
            //try {
                const outName = await zipProject();
                const {showFile} = require('src/lib/platformUtils');
                showFile(outName);
                alertify.success(this.voc.successZipProject.replace('{0}', outName));
            /*} catch (e) {
                alertify.error(e);
                throw e;
            }*/
        };

        this.openProjectSelector = async path => {
            const [projFile] = await os.showOpenDialog(this.vocFull.mainMenu.project.openProject, {
                defaultPath: path,
                filters: [{
                    name: 'ct.js project',
                    extensions: ['.ict']
                }]
            });
            if (!projFile) {
                return;
            }
            window.signals.trigger('resetAll');
            const {openProject} = require('src/lib/resources/projects');
            openProject(projFile);
        };

        this.openProject = async () => {
            const glob = require('src/lib/glob');
            const projects = require('src/lib/resources/projects');
            if (!glob.modified) {
                this.openProjectSelector(await projects.getDefaultProjectDir());
            } else {
                alertify.confirm(this.vocGlob.reallyExitConfirm)
                .then(async e => {
                    if (e.buttonClicked === 'ok') {
                        this.openProjectSelector(await projects.getDefaultProjectDir());
                    }
                });
            }
        };

        this.openExample = async () => {
            const glob = require('src/lib/glob');
            const projects = require('src/lib/resources/projects');
            if (!glob.modified) {
                this.openProjectSelector(await projects.getExamplesDir());
            } else {
                alertify.confirm(this.vocGlob.reallyExitConfirm)
                .then(async e => {
                    if (e.buttonClicked === 'ok') {
                        this.openProjectSelector(await projects.getExamplesDir());
                    }
                });
            }
        };

        this.startNewWindow = async () => {
            const {window, app} = Neutralino;
            const windowSettings = (await app.getConfig()).modes.window;
            window.create('/', {
                ...windowSettings,
                processArgs: isDev() ? '--ctjs-devmode' : ''
            });
            if (window.updateWindowMenu) {
                window.updateWindowMenu();
            }
        };

        this.toStartScreen = () => {
            const glob = require('src/lib/glob');
            if (!glob.modified) {
                window.signals.trigger('resetAll');
            } else {
                alertify.confirm(this.vocGlob.reallyExitConfirm)
                .then(e => {
                    if (e) {
                        window.signals.trigger('resetAll');
                    }
                });
            }
        };

        this.convertToJs = () => {
            alertify.confirm(this.voc.confirmationConvertToJs)
            .then(e => {
                if (!e) {
                    return;
                }
                const {convertCivetToJs} = require('src/lib/resources/projects/convertLanguage');
                convertCivetToJs();
                this.update();
            });
        };

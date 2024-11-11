//-
    This tag shows the list of latest projects, examples, and templates.
    This is the tag you see after starting ct.js.
project-selector
    div
        button.inline.toright(onclick="{toggleLanguageSelector}")
            svg.feather
                use(xlink:href="#translate")
            span {vocFull.mainMenu.settings.language}
        h1.nmt(class="{en: vocFull.me.id === 'Eng'}") {welcomeHeader()}
        .clear
    .flexrow.project-selector-aMainSection
        .aPanel.flexfix.nogrow
            ul.aNav.tabs.flexfix-header.nb
                li.nbl(class="{active: tab === 'projects'}" onclick="{changeTab('projects')}")
                    svg.feather
                        use(xlink:href="#folder")
                    span {voc.latest}
                li(class="{active: tab === 'create'}" onclick="{changeTab('create')}")
                    svg.feather
                        use(xlink:href="#plus")
                    span {voc.newProject.header}
                li(class="{active: tab === 'examples'}" onclick="{changeTab('examples')}")
                    svg.feather
                        use(xlink:href="#book-open")
                    span {voc.examples}
                li.nbr(class="{active: tab === 'templates'}" onclick="{changeTab('templates')}")
                    svg.feather
                        use(xlink:href="#platformer")
                    span {voc.templates}
            .flexfix-body.pad(show="{tab === 'projects'}")
                .flexrow
                    h2.nmt {voc.latest}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="#folder")
                            span {voc.browse}
                .clear
                ul.Cards.largeicons.nmb(if="{latestProjects.length}")
                    li.aCard(
                        each="{project in latestProjects}"
                        onclick="{loadProjectByPath}"
                        title="{project.path}"
                    )
                        .aCard-aThumbnail
                            img(src="{project.image}")
                        .aCard-Properties
                            span {project.name}
                        .aCard-Actions
                            button.tiny.forcebackground(onclick="{cloneProject}" title="{voc.cloneProject}")
                                svg.feather
                                    use(xlink:href="#copy")
                            button.tiny.forcebackground(onclick="{forgetProject}" title="{voc.forgetProject}")
                                svg.feather
                                    use(xlink:href="#x")
                .center.pad(if="{!latestProjects.length}")
                    svg.anIllustration
                        use(xlink:href="data/img/weirdFoldersIllustration.svg#illustration")
                    br
                    span {voc.nothingToShowFiller}
            .flexfix-body.pad(show="{tab === 'create'}")
                #theNewProjectField
                    h2.nmt {voc.newProject.header}
                    .theNewProjectField-aLabel
                        b {voc.newProject.projectName}
                    .theNewProjectField-aValue
                        input(
                            type="text"
                            placeholder="{voc.newProject.input}"
                            pattern="[a-zA-Z_0-9]\\{1,\\}"
                            oninput="{setProjectName}"
                            value="{projectName}"
                            width="20"
                            maxlength="64"
                        )
                    .theNewProjectField-aLabel
                        b {voc.newProject.language}
                    .theNewProjectField-aValue
                        .aButtonGroup.nm
                            button.inline(onclick="{() => this.projectLanguage = 'civet'}" class="{active: projectLanguage === 'civet'}")
                                svg.icon
                                    use(xlink:href="#civet")
                                span Civet
                            button.inline(onclick="{() => this.projectLanguage = 'typescript'}" class="{active: projectLanguage === 'typescript'}")
                                svg.icon
                                    use(xlink:href="#javascript")
                                span JavaScript
                            button.inline(onclick="{() => this.projectLanguage = 'catnip'}" class="{active: projectLanguage === 'catnip'}")
                                svg.feather
                                    use(xlink:href="#catnip")
                                span Catnip
                        .anActionableIcon(onclick="{showCodeLanguageSelector}")
                            svg.feather
                                use(xlink:href="#help-circle")
                    .theNewProjectField-aLabel
                        b {voc.newProject.saveFolder}
                    .theNewProjectField-aValue.flexrow
                        button.inline.nogrow(onclick="{chooseProjectFolder}")
                            svg.feather
                                use(xlink:href="#folder")
                            span {vocGlob.selectDialogue}
                        .aSpacer.nogrow
                        span.crop.small {requirePath.join(savePath, projectName)}
                    button.big.theNewProjectField-aButton(onclick="{createProject}")
                        svg.feather
                            use(xlink:href="#sparkles")
                        span {vocGlob.create}
            .flexfix-body.pad(show="{tab === 'examples'}")
                .flexrow
                    h2.nmt {voc.examples}
                    label.file.nm.nogrow
                        button.inline.nml.nmr(onclick="{openProjectFind}")
                            svg.feather
                                use(xlink:href="#folder")
                            span {voc.browse}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in exampleProjects}"
                        onclick="{isMac ? cloneProject : loadProjectByPath}"
                        title="{project.path}"
                    )
                        .aCard-aThumbnail
                            img(src="{project.image}")
                        .aCard-Properties
                            span {project.name}
                        .aCard-Actions
                            button.tiny(onclick="{cloneProject}" title="{voc.cloneProject}")
                                svg.feather
                                    use(xlink:href="#copy")
            .flexfix-body.pad(show="{tab === 'templates'}")
                h2.nmt {voc.templates}
                p.nmt {voc.templatesInfo}
                .clear
                ul.Cards.largeicons.nmb
                    li.aCard(
                        each="{project in templateProjects}"
                        onclick="{cloneProject}"
                        title="{project.path}"
                    )
                        .aCard-aThumbnail
                            img(src="{project.image}")
                        .aCard-Properties
                            span {project.name}
                        .aCard-Actions
                            button.tiny(onclick="{cloneProject}" title="{voc.cloneProject}")
                                svg.feather
                                    use(xlink:href="#copy")
        aside.flexcol
            svg.anIllustration.wide
                use(xlink:href="data/img/ctjsLogo.svg#illustration")
            .center
                | Ct.js v{ctjsVersion}. ({getCtPackageType()})
                div(if="{newVersion}")
                    span {newVersion}
                    |
                    |
                    img(src="data/img/partycarrot.gif" if="{newVersion}").aPartyCarrot
            // as itch releases are always in sync with the fetched version number, let's route users to itch.io page
            .button(if="{newVersion}" href="https://comigo.itch.io/ct#download" onclick="{openExternal}")
                svg.feather
                    use(xlink:href="#external-link")
                span {vocGlob.download}
            .center.project-selector-SocialLinks
                a(href="https://github.com/orgs/ct-js/" title="{voc.github}" onclick="{openExternal('https://github.com/orgs/ct-js/')}")
                    svg.icon
                        use(xlink:href="#github")
                a(href="https://comigo.itch.io/ct" title="{voc.itch}" onclick="{openExternal('https://comigo.itch.io/ct')}")
                    svg.icon
                        use(xlink:href="#itch-dot-io")
                a(href="{vocFull.regionalLinks.discord}" title="{voc.discord}" onclick="{openExternal(vocFull.regionalLinks.discord)}")
                    svg.icon
                        use(xlink:href="#discord")
                a(href="https://twitter.com/ctjsrocks" title="{voc.twitter}" onclick="{openExternal('https://twitter.com/ctjsrocks')}")
                    svg.icon
                        use(xlink:href="#twitter")
                a(href="{vocFull.regionalLinks.telegram}" title="{voc.telegram}" onclick="{openExternal(vocFull.regionalLinks.telegram)}")
                    svg.icon
                        use(xlink:href="#telegram")
                a(href="https://vk.com/ctjsrocks" title="{voc.vkontakte}" onclick="{openExternal('https://vk.com/ctjsrocks')}")
                    svg.icon
                        use(xlink:href="#vk")
                //
                    a(href="https:/patreon.com/comigo" title="{voc.patreon}" onclick="{openExternal('https:/patreon.com/comigo')}")
                        svg.icon
                            use(xlink:href="#patreon")
                a(href="https://boosty.to/comigo" title="{voc.boosty}" onclick="{openExternal('https://boosty.to/comigo')}")
                    svg.icon
                        use(xlink:href="#boosty")
            .aSpacer
            .center.project-selector-aPatronsLine(if="{featuredPatron}")
                svg.feather
                    use(xlink:href="#heart")
                span(if="{featuredPatron.rank === 'partner'}") {voc.sponsoredBy.replace('$1', featuredPatron.name)}
                span(if="{featuredPatron.rank !== 'partner'}") {voc.supportedBy.replace('$1', featuredPatron.name)}
            .button(href="https://boosty.to/comigo" onclick="{openExternal('https://boosty.to/comigo')}")
                svg.icon
                        use(xlink:href="#boosty")
                span {vocGlob.donate}
            .button(href="{vocFull.regionalLinks.discord}" onclick="{openExternal(vocFull.regionalLinks.discord)}")
                svg.icon
                    use(xlink:href="#discord")
                span {voc.discord}
            .button(href="{vocFull.regionalLinks.telegram}" onclick="{openExternal(vocFull.regionalLinks.telegram)}")
                svg.icon
                    use(xlink:href="#telegram")
                span {voc.telegram}
    home-news
    context-menu(menu="{languagesSubmenu}" ref="languageslist")
    coding-language-selector(
        if="{codeLanguageSelector}"
        oncancelled="{hideCodeLanguageSelector}"
        onselected="{applyCodeLanguage}"
    )
    script.
        const fs = require('src/lib/neutralino-fs-extra'),
              path = require('path');
        const {os} = Neutralino;

        this.isMac = require('src/lib/platformUtils').isMac;
        const {write} = require('src/lib/neutralino-storage');
        const {run} = require('src/lib/buntralino-client');
        const {openProject} = require('src/lib/resources/projects');
        this.ctjsVersion = window.ctjsVersion;
        this.requirePath = path;
        this.namespace = 'intro';
        this.mixin(require('src/lib/riotMixins/voc').default);

        let randIndex;
        if (!localStorage.firstRunWelcome) {
            write('firstRunWelcome', 'shown');
            this.welcomeHeader = () => this.voc.newUserHeader;
        } else {
            randIndex = Math.floor(Math.random() * this.voc.welcomeHeaders.length);
            this.welcomeHeader = () => {
                // Might get out of bounds after a language changes, recheck the index
                if (randIndex >= this.voc.welcomeHeaders.length) {
                    randIndex = Math.floor(Math.random() * this.voc.welcomeHeaders.length);
                }
                return this.voc.welcomeHeaders[randIndex];
            };
        }

        this.savePath = '';
        this.projectLanguage = void 0;
        this.projectName = '';

        const {getDirectories} = require('src/lib/platformUtils');
        let defaultProjectDir;
        getDirectories().then(dirs => {
            defaultProjectDir = dirs.projects + '/';
            this.savePath = defaultProjectDir;
            this.update();
        });

        this.tab = 'projects';
        this.changeTab = tab => () => {
            this.tab = tab;
        };

        this.visible = true;
        var hideProjectSelector = () => {
            this.visible = false;
            this.parent.selectorVisible = false;
            this.update();
        };
        window.signals.on('hideProjectSelector', hideProjectSelector);
        this.on('unmount', () => {
            window.signals.off('hideProjectSelector', hideProjectSelector);
        });
        this.projectSplash = 'data/img/notexture.png';
        this.newVersion = false;

        const projects = require('src/lib/resources/projects');
        const {BlobCache} = require('src/lib/blobCache');
        const splashesCache = new BlobCache();
        splashesCache.bind(this);

        this.exampleProjects = [];
        this.templateProjects = [];

        // Loads examples and templates
        const loadBundledProjects = async (dir, array) => {
            const entries = (await fs.readdir(dir, {
                withFileTypes: true
            })).filter(entry => entry.isFile() && (/\.ict$/i).test(entry.name));

            const splashBlobs = await splashesCache.get(entries
                .map(entry => path.join(path.join(entry.parentPath, entry.name)
                    .slice(0, -4), 'img/splash.png')));
            array.length = 0;
            array.push(...entries.map((entry, ind) => ({
                path: path.join(entry.parentPath, entry.name),
                name: entry.name,
                image: splashBlobs[ind].url
            })));
            this.update();
        }
        loadBundledProjects(projects.getExamplesDir(), this.exampleProjects);
        loadBundledProjects(projects.getTemplatesDir(), this.templateProjects);

        // Loads recently opened projects
        this.latestProjects = [];
        (async () => {
            if (('lastProjects' in localStorage) &&
                (localStorage.lastProjects !== '')
            ) {
                const latestPaths = localStorage.lastProjects.split(';');
                let removedNonexistent = false;

                await Promise.all(latestPaths.map(proj => fs.pathExists(proj)
                .then(exists => {
                    if (!exists) {
                        latestPaths.splice(latestPaths.indexOf(proj), 1);
                        removedNonexistent = true;
                    }
                })
                .catch(err => {
                    alertify.log(`Got a strange error while trying to access ${proj}. See the console for more details.`);
                    console.error(err);
                })))
                .then(() => {
                    if (removedNonexistent) {
                        alertify.log('Removed some projects from the list, as they no longer exist.');
                        write('lastProjects', latestPaths.join(';'));
                    }
                    this.update();
                });

                const splashBlobs = await splashesCache.get(latestPaths
                    .map(entry => path.join(entry.slice(0, -4), 'img/splash.png')));
                this.latestProjects = latestPaths.map((entry, ind) => ({
                    path: entry,
                    name: path.basename(entry).slice(0, -4),
                    image: splashBlobs[ind].url
                }));
                this.update();
            } else {
                this.latestProjects = [];
            }
        })();

        /**
         * Creates a new project.
         * Technically it creates an empty project in-memory, then saves it to a directory.
         * Creates basic directories for sounds and textures.
         */
        this.newProject = async (way, codename) => {
            sessionStorage.showOnboarding = true;
            const defaultProject = require('src/lib/resources/projects/defaultProject').get();
            const {gitignore} = require('src/lib/resources/projects/defaultGitignore');
            defaultProject.language = this.projectLanguage;
            const YAML = require('js-yaml');
            const projectYAML = YAML.safeDump(defaultProject);
            fs.outputFile(path.join(way, codename + '.ict'), projectYAML)
            .catch(e => {
                alertify.error(this.voc.unableToWriteToFolders + '\n' + e);
                throw e;
            });
            window.projdir = path.join(way, codename);
            sessionStorage.projname = codename + '.ict';
            await fs.ensureDir(path.join(window.projdir, '/img'));
            fs.ensureDir(path.join(window.projdir, '/snd'));
            fs.ensureDir(path.join(window.projdir, '/include'));
            fs.outputFile(path.join(way, '.gitignore'), gitignore);
            setTimeout(() => { // for some reason, it must be done through setTimeout; otherwise it fails
                fs.copy('./data/img/notexture.png', path.join(window.projdir + '/img/splash.png'), e => {
                    if (e) {
                        alertify.error(e);
                        console.error(e);
                    }
                });
            }, 0);
            openProject(path.join(way, codename + '.ict'));
        };

        /**
         * Opens a recent project when an item in the Recent Project list is double-clicked
         */
        this.loadProjectByPath = e => {
            const projectPath = e.item.project.path;
            openProject(projectPath);
        };
        /**
         * Prompts user to clone a project into a different folder/under a different name.
         */
        this.cloneProject = e => {
            e.stopPropagation();
            // Should create a separate async function; otherwise e.stopPropagation(); won't work
            (async () => {
                const {path} = e.item.project;
                let newIctLocation = await os.showSaveDialog(void 0, {
                    defaultPath: defaultProjectDir,
                    filters: [{
                        name: 'ct.js project',
                        extensions: ['ict']
                    }]
                });
                if (!newIctLocation.endsWith('.ict')) {
                    newIctLocation += '.ict';
                }
                await fs.copy(project, newIctLocation);
                await fs.copy(project.slice(0, -4), newIctLocation.slice(0, -4));
                openProject(newIctLocation);
            })();
        };
        /**
         * Removes a project from the recents list
         */
        this.forgetProject = e => {
            const {path} = e.item.project;
            this.latestProjects.splice(this.latestProjects.indexOf(path), 1);
            write('lastProjects', this.latestProjects.join(';'));
            e.stopPropagation();
        };

        /**
         * Handler for a manual search for a project folder, triggered by an input[type="file"]
         */
        this.chooseProjectFolder = async () => {
            const projPath = await os.showFolderDialog(this.voc.newProject.selectProjectFolder, {
                defaultPath: defaultProjectDir
            });
            if (projPath) {
                this.savePath = projPath;
                this.update();
            }
        };
        this.setProjectName = e => {
            this.projectName = e.target.value.trim();
            this.projectName = this.projectName.replace(/[^a-zA-Z_0-9]/g, '');
            e.target.value = this.projectName;
        };
        /** A button listener for triggering a project creation process. */
        this.createProject = () => {
            const codename = this.projectName;
            if (codename.length === 0 || /[^a-zA-Z_0-9]/.test(codename)) {
                alertify.error(this.voc.newProject.nameError);
                return;
            }
            if (!this.projectLanguage) {
                alertify.error(this.voc.newProject.languageError);
                return;
            }
            this.newProject(path.join(this.savePath, codename), codename);
        };

        this.codeLanguageSelector = false;
        this.showCodeLanguageSelector = () => {
            this.codeLanguageSelector = true;
        };
        this.hideCodeLanguageSelector = () => {
            this.codeLanguageSelector = false;
            this.update();
        };
        this.applyCodeLanguage = selection => {
            this.projectLanguage = selection;
            this.codeLanguageSelector = false;
            this.update();
        };

        /**
         * Handler for a manual search for a project, triggered by an input[type="file"]
         */
        this.openProjectFind = async () => {
            const defaultProjectDir = require('src/lib/resources/projects').getDefaultProjectDir();
            const [proj] = await os.showOpenDialog(void 0, {
                filters: [{
                    name: 'ct.js project',
                    extensions: ['ict']
                }],
                defaultPath: await defaultProjectDir
            });
            if (!proj) {
                return;
            }
            if (path.extname(proj).toLowerCase() === '.ict') {
                openProject(proj);
                sessionStorage.projname = path.basename(proj);
                // eslint-disable-next-line require-atomic-updates
                window.projdir = path.dirname(proj) + path.sep + path.basename(proj, '.ict');
            } else {
                alertify.error(this.vocGlob.wrongFormat);
            }
        };

        // Checking for updates
        // Cache update status for an hour to not DDoS itch.io while developing.
        let needsUpdateCheck = false,
            lastUpdateCheck;
        if (localStorage.lastUpdateCheck) {
            lastUpdateCheck = new Date(localStorage.lastUpdateCheck);
            // Check once an hour
            if ((new Date()) - lastUpdateCheck > 1000 * 60 * 60) {
                needsUpdateCheck = true;
            }
        } else {
            needsUpdateCheck = true;
        }
        if (needsUpdateCheck) {
            setTimeout(() => {
                const {isWin, isLinux} = require('src/lib/platformUtils.js');
                let channel = 'osx64';
                if (isWin) {
                    channel = 'win64';
                } else if (isLinux) {
                    channel = 'linux64';
                }
                run('fetchJson', `https://itch.io/api/1/x/wharf/latest?target=comigo/ct&channel_name=${channel}`)
                .then(json => {
                    if (!json.errors) {
                        if (this.ctjsVersion !== json.latest) {
                            this.newVersion = this.voc.latestVersion.replace('$1', json.latest);
                            this.update();
                        }
                        write('lastUpdateCheck', String(new Date()));
                        write('lastUpdateCheckVersion', json.latest);
                    } else {
                        console.error('Update check failed:');
                        console.error(json.errors);
                    }
                });
            }, 0);
        } else {
            const newVersion = localStorage.lastUpdateCheckVersion;
            if (this.ctjsVersion !== newVersion) {
                this.newVersion = this.voc.latestVersion.replace('$1', newVersion);
            }
        }

        this.openExternal = link => e => {
            const {os} = Neutralino;
            os.open(link);
            e.stopPropagation();
            e.preventDefault();
        };

        this.languagesSubmenu = {
            items: []
        };
        const {getLanguages} = require('src/lib/i18n');
        getLanguages().then(languages => {
            for (const language of languages) {
                if (language.filename === 'Debug.json') {
                    continue;
                }
                this.languagesSubmenu.items.push({
                    label: `${language.meta.native} (${language.meta.eng})`,
                    icon: () => localStorage.appLanguage === language.filename.slice(0, -5) && 'check',
                    click: () => {
                        this.switchLanguage(language.filename.slice(0, -5));
                    }
                });
            }
        })
        .catch(e => {
            console.error(e);
            alertify.error(`Error while finding i18n files: ${e}`);
        });
        const {loadLanguage} = require('src/lib/i18n.js');
        this.switchLanguage = async name => {
            try {
                this.vocFull = await loadLanguage(name);
                write('appLanguage', name);
                window.signals.trigger('updateLocales');
                window.riot.update();
            } catch (e) {
                alertify.alert('Could not open a language file: ' + e);
            }
        };
        this.toggleLanguageSelector = e => {
            this.refs.languageslist.popup(e.clientX, e.clientY);
        };

        const {getRandomPatron} = require('src/lib/patrons');
        getRandomPatron().then(patron => {
            this.featuredPatron = patron;
            this.update();
        });

        this.packageType = null;
        this.getCtPackageType = () => {
            if (!this.packageType) {
                const packaged = window.NL_RESMODE !== 'directory';
                if (packaged) {
                    this.packageType = 'released';
                    // TODO: Get smart about it
                    /*
                    fs.pathExists('./package.nw/data/nigthly')
                    .then(exists => {
                        if (exists) {
                            this.packageType = 'nightly';
                            this.update();
                        }
                    });
                    */
                } else {
                    this.packageType = 'dev';
                }
            }
            return this.voc.ctDistributions[this.packageType];
        };

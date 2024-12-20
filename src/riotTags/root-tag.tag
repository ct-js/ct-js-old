root-tag(class="{pride: localStorage.prideMode === 'on'}")
    app-view(if="{projectOpened}")
    project-selector(if="{!projectOpened}")
    writable-folder-prompt(if="{showWritableFolderPrompt}" onsuccess="{onWritableSelected}")
    script.
        this.projectOpened = false;
        window.id = Math.random();
        window.signals.on('resetAll', () => {
            window.currentProject = false;
            require('src/node_requires/glob').modified = false;
            this.projectOpened = false;
            riot.update();
        });
        window.signals.on('projectLoaded', () => {
            require('src/node_requires/glob').modified = false;
            this.projectOpened = true;
            this.update();
        });

        require('src/node_requires/platformUtils')
        .getWritableDir()
        .catch(e => {
            console.error(e);
            this.showWritableFolderPrompt = true;
            this.update();
        });

        this.onWritableSelected = () => {
            this.showWritableFolderPrompt = false;
            this.update();
        };

        const stylesheet = document.createElement('style');
        document.head.appendChild(stylesheet);
        const updateStylesheet = () => {
            const css = `
                code, pre {
                    font-family: ${localStorage.fontFamily || 'Iosevka, monospace'};
                    font-variant-ligatures: ${localStorage.codeLigatures === 'off' ? 'none' : 'normal'};
                }
                .monaco-editor .aView-lines.aView-lines {
                    line-height: ${localStorage.codeDense === 'on' ? 1.5 : 1.75};
                }
                body {
                    ${localStorage.specialFont ? 'font-family: ' + localStorage.specialFont + ';' : ''}
                    ${localStorage.specialFont ? '--ui-font: ' + localStorage.specialFont + ';' : ''}
                }
            `;
            stylesheet.innerHTML = css;
        };
        updateStylesheet();
        window.signals.on('codeFontUpdated', updateStylesheet);
        window.signals.on('specialFontUpdated', updateStylesheet);
        window.signals.on('prideModeUpdated', () => {
            this.update();
        });

        // eslint-disable-next-line new-cap
        nw.Screen.Init();

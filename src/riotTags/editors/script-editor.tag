script-editor.aPanel.aView.flexfix
    .script-editor-aCodeEditor.flexfix-body.relative.pad
        .tabwrap.tall(style="position: relative")
            .relative.tall.wide(ref="codebox" if="{asset.language !== 'catnip'}")
            catnip-editor.tall(
                if="{asset.language === 'catnip'}"
                asset="{asset}"
                scriptmode="scriptmode"
                onrename="{renamePropVar}"
            )
    .flexfix-footer.pad.npt
        .script-editor-aProblemPanel.wide.flexrow(if="{problem}")
            .nogrow
                svg.feather.warning
                    use(xlink:href="#alert-circle")
            pre.nm {problem.stack.slice(8)}
            .nogrow
                button.inline(onclick="{jumpToProblem}")
                    svg.feather
                        use(xlink:href="#chevron-up")
                    | {vocFull.scriptables.jumpToProblem}
    .flexfix-footer.flexrow.pad.npt
        label.block.checkbox.nogrow.alignmiddle
            input(type="checkbox" checked="{asset.runAutomatically}" onchange="{wire('asset.runAutomatically')}")
            span {voc.runAutomatically}
        .aSpacer.noshrink.nogrow
        label.block.nogrow.alignmiddle
            span {voc.language}
            select(value="{asset.language}" onchange="{changeLanguage}")
                option(value="typescript") TypeScript / JavaScript
                option(value="civet") Civet
                option(value="catnip") Catnip
        .aSpacer.noshrink
        button(onclick="{convertCivet}" if="{asset.language === 'civet'}" disabled="{problem ? 'disabled' : ''}")
            svg.icon
                use(xlink:href="#javascript")
            span {voc.convertToJavaScript}
        button(onclick="{convertCatnip}" if="{asset.language === 'catnip'}")
            svg.icon
                use(xlink:href="#javascript")
            span {voc.convertToJavaScript}
        .aSpacer.nogrow.noshrink
        button(onclick="{scriptSave}" title="Shift+Control+S" data-hotkey="Shift+Control+S")
            svg.feather
                use(xlink:href="#check")
            span {vocGlob.apply}
    script.
        this.namespace = 'scriptView';
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.mixin(require('src/lib/riotMixins/wire').default);
        this.mixin(require('src/lib/riotMixins/discardio').default);

        const {renamePropVar} = require('src/lib/catnip');
        this.renamePropVar = e => {
            if (this.asset.language === 'catnip') {
                renamePropVar(this.asset.code, e);
                this.update();
            }
        };
        // Global var names are automatically patched everywhere in a project,
        // but we need to manually rename them in opened assets to not to overwrite
        // a patch with old variable name
        window.orders.on('catnipGlobalVarRename', this.renamePropVar);
        this.on('unmount', () => {
            window.orders.off('catnipGlobalVarRename', this.renamePropVar);
        });

        this.saveAsset = () => {
            this.writeChanges();
            return true;
        };
        this.scriptSave = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };


        let prevLanguage = this.asset.language;
        const updateEditor = () => {
            this.codeEditor.updateOptions({
                readOnly: false
            });
            if (prevLanguage !== this.asset.language) {
                monaco.editor.setModelLanguage(this.codeEditor.getModel(), this.asset.language);
                prevLanguage = this.asset.language;
            }
            let codePrefix = 'function ctJsScript(options: Record<string, any>) {';
            this.codeEditor.setValue(this.asset.code);
            if (this.asset.language === 'typescript') {
                this.codeEditor.setWrapperCode(codePrefix, '}');
            } else {
                codePrefix = 'function ctJsScript(options: Record<string, any>) {';
                this.codeEditor.defineWrapperCode(codePrefix, '}');
            }
            this.codeEditor.getModel().ctCodePrefix = codePrefix;
        };
        const setupCodeEditor = () => {
            const editorOptions = {
                language: this.asset.language
            };
            this.codeEditor = window.setupCodeEditor(
                this.refs.codebox,
                Object.assign({}, editorOptions, {
                    value: '',
                    wrapper: [' ', ' ']
                })
            );
            updateEditor();
            this.codeEditor.onDidChangeModelContent(() => {
                if (this.asset) {
                    this.asset.code = this.codeEditor.getPureValue();
                }
            });
            this.codeEditor.focus();
        };

        this.changeLanguage = e => {
            const newLang = e.target.value;
            if (newLang !== this.asset.language) {
                this.problem = false;
                if (newLang === 'catnip') {
                    if (this.codeEditor.getPureValue().trim()) {
                        e.preventUpdate = true;
                        alertify.confirm(this.voc.confirmSwitchToCatnip)
                        .then(e => {
                            if (e.buttonClicked === 'ok') {
                                this.asset.code = [];
                                this.codeEditor.dispose();
                                this.asset.language = 'catnip';
                                this.update();
                            }
                        });
                    } else {
                        this.asset.code = [];
                        this.codeEditor.dispose();
                        this.asset.language = newLang;
                    }
                } else if (this.asset.language === 'catnip') {
                    if (this.asset.code.length) {
                        e.preventUpdate = true;
                        alertify.confirm(this.voc.confirmSwitchFromCatnip)
                        .then(e => {
                            if (e.buttonClicked === 'ok') {
                                this.asset.code = '';
                                this.asset.language = newLang;
                                this.update();
                                setupCodeEditor();
                            }
                        });
                    } else {
                        this.asset.code = '';
                        this.asset.language = newLang;
                        this.update();
                        setupCodeEditor();
                    }
                } else {
                    this.asset.language = newLang;
                    updateEditor();
                }
            } else {
                e.preventUpdate = true;
            }
        };

        const layout = () => {
            if (this.asset.language === 'catnip') {
                return;
            }
            setTimeout(() => {
                this.codeEditor.layout();
            }, 150);
        };
        this.on('mount', () => {
            window.addEventListener('resize', layout);
            setTimeout(() => {
                if (this.asset.language !== 'catnip') {
                    setupCodeEditor();
                }
            }, 0);
        });
        window.orders.on('forceCodeEditorLayout', layout);
        this.on('unmount', () => {
            if (this.asset.language !== 'catnip') {
                // Manually destroy code editors, to free memory
                this.codeEditor.dispose();
            }
            window.removeEventListener('resize', layout);
            window.orders.off('forceCodeEditorLayout', layout);
        });

        this.jumpToProblem = () => {
            this.codeEditor.setPosition({
                lineNumber: this.problem.location.last_line + 1,
                column: this.problem.location.last_column + 1
            });
            this.codeEditor.focus();
        };

        const civet = require('@danielx/civet').compile;
        this.convertCivet = () => {
            try {
                const val = civet(this.codeEditor.getValue(), {
                    bare: true,
                    sourcemaps: false
                });
                this.problem = false;
                this.asset.code = val;
                this.asset.language = 'typescript';
                updateEditor();
            } catch (err) {
                this.problem = err;
            }
        };
        this.convertCatnip = () => {
            const {compile} = require('src/lib/catnip/compiler');
            try {
                const val = compile(this.asset.code, {
                    eventKey: 'script',
                    resourceId: this.asset.uid,
                    resourceName: this.asset.name,
                    resourceType: 'script'
                });
                this.asset.code = val;
                this.asset.language = 'typescript';
                this.update();
                setupCodeEditor();
            } catch (err) {
                window.alertify.error(err);
            }
        };

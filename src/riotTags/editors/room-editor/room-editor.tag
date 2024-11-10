//
    @attribute asset
        The room to edit
    @attribute ondone (riot function)

room-editor.aPanel.aView(data-hotkey-scope="{asset.uid}")
    canvas(ref="canvas" oncontextmenu="{openMenus}")
    .room-editor-aToolsetHolder
        // Toolbar
        .room-editor-aToolbar.aButtonGroup.vertical
            button.forcebackground(
                onclick="{setTool('select')}"
                class="{active: currentTool === 'select'}"
                title="{voc.tools.select} (Q)"
                data-hotkey="q"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#cursor")
            button.forcebackground(
                onclick="{setTool('addCopies')}"
                class="{active: currentTool === 'addCopies'}"
                title="{voc.tools.addCopies} (W)"
                data-hotkey="w"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#template")
            button.forcebackground(
                onclick="{setTool('addTiles')}"
                class="{active: currentTool === 'addTiles'}"
                title="{voc.tools.addTiles} (E)"
                data-hotkey="e"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#grid")
            button.forcebackground(
                onclick="{setTool('manageBackgrounds')}"
                class="{active: currentTool === 'manageBackgrounds'}"
                title="{voc.tools.manageBackgrounds} (R)"
                data-hotkey="r"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#image")
            button.forcebackground(
                onclick="{setTool('uiTools')}"
                class="{active: currentTool === 'uiTools'}"
                title="{voc.tools.uiTools} (T)"
                data-hotkey="t"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#ui")
            button.forcebackground(
                onclick="{setTool('roomProperties')}"
                class="{active: currentTool === 'roomProperties'}"
                title="{voc.tools.roomProperties} (Y)"
                data-hotkey="y"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#settings")

        // Contextual panels for tools
        .room-editor-aContextPanel(
            if="{currentTool === 'select' && pixiEditor}"
        )
            h3.nogrow.nm.inlineblock {vocGlob.select}:
            .aSpacer.inlineblock
            .aButtonGroup.nm
                button.inline.square(
                    each="{lockable in lockableTypes}"
                    class="{active: parent.pixiEditor && parent.pixiEditor[lockable.key]}"
                    onclick="{toggleSelectables}"
                    title="{voc[lockable.hintVocKey]}"
                )
                    svg.feather
                        use(xlink:href="#{lockable.icon}")
            room-entities-properties(ref="propertiesPanel" pixieditor="{pixiEditor}" ontransformchange="{updateSelectFrame}")
        room-properties.room-editor-aContextPanel(
            if="{currentTool === 'roomProperties'}"
            room="{room}"
            editor="{pixiEditor}"
            history="{pixiEditor?.history}"
            updatebg="{changeBgColor}"
            ref="propertiesPanel"
        )
        room-template-picker.room-editor-aContextPanel(
            if="{currentTool === 'addCopies'}"
            onselect="{changeSelectedTemplate}"
            selectedtemplate="{currentTemplate}"
        )
        room-tile-editor.room-editor-aContextPanel(
            if="{currentTool === 'addTiles'}"
            room="{asset}"
            layer="{currentTileLayer}"
            layers="{pixiEditor.tileLayers}"
            onchangetile="{changeTilePatch}"
            onchangelayer="{changeTileLayer}"
            pixieditor="{pixiEditor}"
            removelayer="{pixiEditor?.removeLayer?.bind(pixiEditor)}"
            addlayer="{pixiEditor?.addTileLayer?.bind(pixiEditor)}"
            ref="tileEditor"
        )
        room-backgrounds-editor.room-editor-aContextPanel(
            if="{currentTool === 'manageBackgrounds'}"
            backgrounds="{pixiEditor?.backgrounds}"
            addbackground="{pixiEditor?.addBackground?.bind(pixiEditor)}"
            room="{room}"
            history="{pixiEditor?.history}"
            ref="backgroundsEditor"
        )
        room-ui-tools.room-editor-aContextPanel(
            if="{currentTool === 'uiTools'}"
            selection="{pixiEditor?.currentUiSelection}"
            pixieditor="{pixiEditor}"
            ref="uiTools"
        )

        // Global controls placed at the top-center
        .room-editor-aTopPanel
            button.slim(onclick="{pixiEditor?.history.undo.bind(pixiEditor.history)}" title="{vocGlob.undo} (Ctrl+Z)" class="{dim: !pixiEditor?.history.canUndo}")
                svg.feather
                    use(xlink:href="#undo")
            button.slim(onclick="{pixiEditor?.history.redo.bind(pixiEditor.history)}" title="{vocGlob.redo} (Ctrl+Shift+Z)" class="{dim: !pixiEditor?.history.canRedo}")
                svg.feather
                    use(xlink:href="#redo")
            label.checkbox(title="Shift+S")
                input(
                    type="checkbox"
                    onchange="{changeSimulated}"
                    checked="{pixiEditor?.simulate}"
                    data-hotkey="S"
                    data-hotkey-require-scope="{asset.uid}"
                )
                span {voc.simulate}
            button(onclick="{openZoomMenu}")
                span(ref="zoomLabel") {Math.round(pixiEditor?.getZoom() || 100)}%
            button(onclick="{openGridMenu}")
                span {voc.grid}
            button.slim(onclick="{openVisibilityMenu}")
                svg.feather
                    use(xlink:href="#eye")
            button(onclick="{openEventsList}")
                span {voc.events}
            button(onclick="{saveRoom}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}

        // Additional contextual panels on the right side
        room-entities-list.room-editor-aContextPanel.np(
            if="{currentTool === 'select' && currentEntityList}"
            entitytype="{currentEntityList}"
            room="{asset}"
            editor="{pixiEditor}"
            ref="entriesList"
        )
        // Additional contextual tools
        .room-editor-aToolbar.aButtonGroup.vertical.last(if="{currentTool === 'select'}")
            button.forcebackground(
                onclick="{setEntityList('copies')}"
                class="{active: currentEntityList === 'copies'}"
                title="{voc.tools.copiesList} (A)"
                data-hotkey="a"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#template")
            button.forcebackground(
                onclick="{setEntityList('tiles')}"
                class="{active: currentEntityList === 'tiles'}"
                title="{voc.tools.tilesList} (S)"
                data-hotkey="s"
                data-hotkey-require-scope="{asset.uid}"
            )
                svg.feather
                    use(xlink:href="#grid")
    room-events-editor(if="{editingEvents}" room="{room}" onsave="{closeRoomEvents}")
    context-menu(menu="{gridMenu}" ref="gridMenu")
    context-menu(menu="{zoomMenu}" ref="zoomMenu")
    context-menu(menu="{visibilityMenu}" ref="visibilityMenu" if="{pixiEditor}")
    context-menu(menu="{entitiesMenu}" ref="entitiesMenu" if="{pixiEditor}")
    script.
        const PIXI = require('pixi.js');
        this.namespace = 'roomView';
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.mixin(require('src/lib/riotMixins/discardio').default);
        // The default discardio's handler won't work as the room editor
        // writes most changes to this.asset only on save due to serialization/deserialization
        const defaultIsDirty = this.isDirty;
        this.isDirty = () => defaultIsDirty() || this.pixiEditor.history.stack.length;

        const {validateBehaviorExtends} = require('src/lib/resources/behaviors');
        validateBehaviorExtends(this.asset);

        this.room = this.asset;

        this.freePlacementMode = false;
        const modifiersDownListener = e => {
            if (e.repeat ||
                !window.hotkeys.inScope(this.asset.uid) ||
                window.hotkeys.isFormField(e.target)
            ) {
                return;
            }
            if (e.key === 'Alt') {
                this.freePlacementMode = true;
                e.preventDefault();
            } else if (e.key === 'Control' || e.key === 'Meta') {
                if (e.shiftKey) {
                    this.controlMode = false;
                } else {
                    this.controlMode = true;
                }
                e.preventDefault();
            } else if (e.key === 'Shift') {
                this.controlMode = false;
            } else if (e.key === ' ') {
                this.spacebarMode = true;
                e.preventDefault();
            }
        };
        const modifiersUpListener = e => {
            if (e.repeat ||
                !window.hotkeys.inScope(this.asset.uid) ||
                window.hotkeys.isFormField(e.target)
            ) {
                return;
            }
            if (e.key === 'Alt') {
                this.freePlacementMode = false;
                e.preventDefault();
            } else if (e.key === 'Control' || e.key.Meta) {
                this.controlMode = false;
                e.preventDefault();
            } else if (e.key === ' ') {
                this.spacebarMode = false;
                e.preventDefault();
            }
        };
        const blurListener = () => {
            // Specifically designed to catch Alt+Tab
            this.freePlacementMode = false;
        };
        const gridToggleListener = e => {
            if (!window.hotkeys.inScope(this.asset.uid) || window.hotkeys.isFormField(e.target)) {
                return;
            }
            this.gridOn = !this.gridOn;
            this.asset.disableGrid = !this.gridOn;
        };
        const checkRefs = deleted => {
            let cleaned = false;
            if (this.asset.follow === deleted) {
                this.asset.follow = -1;
                cleaned = true;
                // eslint-disable-next-line no-console
                console.debug(`Removed a template with ID ${deleted} from a room ${this.asset.name}.`);
            }
            if (this.asset.behaviors.find(b => b === deleted)) {
                this.asset.behaviors = this.asset.behaviors.filter(b => b !== deleted);
                cleaned = true;
                // eslint-disable-next-line no-console
                console.debug(`Removed a behavior with ID ${deleted} from a room ${this.asset.name}.`);
            }
            if (cleaned) {
                this.update();
            }
        };
        this.on('mount', () => {
            window.hotkeys.on('Control+g', gridToggleListener);
            document.addEventListener('keydown', modifiersDownListener);
            document.addEventListener('keyup', modifiersUpListener);
            window.addEventListener('blur', blurListener);
            window.signals.on('templateRemoved', checkRefs);
            window.signals.on('behaviorRemoved', checkRefs);
        });
        this.on('unmount', () => {
            window.hotkeys.exit('roomEditor');
            window.hotkeys.off('Control+g', gridToggleListener);
            document.removeEventListener('keydown', modifiersDownListener);
            document.removeEventListener('keyup', modifiersUpListener);
            window.addEventListener('blur', blurListener);
            window.signals.off('templateRemoved', checkRefs);
            window.signals.off('behaviorRemoved', checkRefs);
        });

        this.lockableTypes = [{
            icon: 'template',
            hintVocKey: 'copies',
            key: 'selectCopies'
        }, {
            icon: 'grid',
            hintVocKey: 'tiles',
            key: 'selectTiles'
        }];
        this.toggleSelectables = e => {
            this.pixiEditor[e.item.lockable.key] = !this.pixiEditor[e.item.lockable.key];
        };
        this.updateSelectFrame = () => {
            this.pixiEditor.transformer.setup();
        };

        const {setup} = require('src/lib/roomEditor');
        this.on('mount', () => {
            setup(this.refs.canvas, this);
            // adds this.pixiEditor
            [this.currentTileLayer] = this.pixiEditor.tileLayers;
            this.update();
        });
        this.on('unmount', () => {
            this.pixiEditor.destroy(false, {
                children: true
            });
        });
        // Keyboard events
        const phabricateEvent = (name, e) => {
            this.pixiEditor.observable.trigger(name, e);
        };
        /**
         * Routes DOM keyboard events into the RoomEditor to trigger hotkey events there.
         */
        // eslint-disable-next-line complexity
        const triggerKeyboardEvent = e => {
            if (!window.hotkeys.inScope(this.asset.uid)) {
                return false;
            }
            if (['input', 'textarea', 'select'].includes(e.target.nodeName.toLowerCase())) {
                return false;
            }
            const ctrlKey = navigator.platform.indexOf('Mac') > -1 ?
                e.metaKey :
                e.ctrlKey;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                return phabricateEvent('delete', e);
            } else if (e.code === 'KeyC' && ctrlKey) {
                return phabricateEvent('copy', e);
            } else if (e.code === 'KeyV' && ctrlKey) {
                return phabricateEvent('paste', e);
            } else if (e.code === 'KeyZ' && ctrlKey && e.shiftKey) {
                return phabricateEvent('redo', e);
            } else if (e.code === 'KeyZ' && ctrlKey) {
                return phabricateEvent('undo', e);
            } else if (e.code === 'KeyH') {
                return phabricateEvent('home', e);
            } else if (e.key === 'ArrowRight') {
                return phabricateEvent('nudgeright', e);
            } else if (e.key === 'ArrowLeft') {
                return phabricateEvent('nudgeleft', e);
            } else if (e.key === 'ArrowUp') {
                return phabricateEvent('nudgeup', e);
            } else if (e.key === 'ArrowDown') {
                return phabricateEvent('nudgedown', e);
            } else if (e.key === 'Tab') {
                phabricateEvent('tab', e);
                return e.preventDefault();
            }
            return false;
        };
        this.on('mount', () => {
            window.addEventListener('keydown', triggerKeyboardEvent);
        });
        this.on('unmount', () => {
            window.removeEventListener('keydown', triggerKeyboardEvent);
        });

        this.currentTool = 'select';
        /**
         * Describes which tools must have specific entity types visible.
         * When a tool is selected and the entity type is hidden, its visibility
         * is automatically turned on.
         * The dictionary maps tools' names to boolean flags in the RoomEditor class.
         */
        const mandatoryVisibilityMap = {
            addCopies: 'copiesVisible',
            addTiles: 'tilesVisible',
            manageBackgrounds: 'backgroundsVisible',
            uiTools: 'copiesVisible'
        };
        this.setTool = tool => e => {
            const prevTool = this.currentTool;
            if (tool === prevTool) { // Bail out w/o a redraw if a user selects the same tool
                e.preventUpdate = true;
                return;
            }
            this.currentTool = tool;
            if (tool in mandatoryVisibilityMap) {
                this.pixiEditor[mandatoryVisibilityMap[tool]] = true;
            }
            // Preselect a copy when switching from 'select' to 'uiTools'
            if (prevTool === 'select' &&
                tool === 'uiTools' &&
                this.pixiEditor.currentSelection.size === 1
            ) {
                [this.pixiEditor.currentUiSelection] = this.pixiEditor.currentSelection;
                this.pixiEditor.history.initiateUiChange();
            }

            if (tool !== 'select') {
                // Clear hover visualization when switching to modes other than 'select'
                this.pixiEditor.clearSelectionOverlay(true);
                // Deselect everything
                this.pixiEditor.transformer.clear();
            }
            if (tool !== 'uiTools') {
                this.pixiEditor.currentUiSelection = void 0;
            }

            // Preselect the first tile layer, if another one was not selected before
            if (tool === 'addTiles' && !this.pixiEditor.tileLayers.includes(this.currentTileLayer)) {
                [this.currentTileLayer] = this.pixiEditor.tileLayers;
            }
        };
        this.setEntityList = entityType => () => {
            if (this.currentEntityList !== entityType) {
                this.currentEntityList = entityType;
            } else {
                this.currentEntityList = void 0;
            }
        };

        /* These are used to describe current template selection when the addCopy tool is on */
        this.currentTemplate = -1;
        this.changeSelectedTemplate = template => {
            this.currentTemplate = template;
            this.update();
        };

        this.tilePatch = void 0;
        this.changeTilePatch = tilePatch => {
            this.tilePatch = tilePatch;
        };
        this.changeTileLayer = layer => {
            this.currentTileLayer = layer;
        };

        this.zoom = 1;

        this.changeBgColor = (e, color) => {
            this.room.backgroundColor = color;
            this.pixiEditor.renderer.backgroundColor = PIXI.utils.string2hex(color);
        };

        this.changeSimulated = () => {
            this.pixiEditor.simulate = !this.pixiEditor.simulate;
        };

        this.gridOn = !this.asset.disableGrid;
        this.gridMenu = {
            opened: false,
            items: [{
                label: this.voc.gridOff,
                click: () => {
                    this.gridOn = !this.gridOn;
                    this.asset.disableGrid = !this.gridOn;
                },
                type: 'checkbox',
                checked: () => !this.gridOn,
                hotkeyLabel: 'Ctrl+G'
            }, {
                label: this.voc.toggleDiagonalGrid,
                click: () => {
                    this.room.diagonalGrid = !this.room.diagonalGrid;
                },
                type: 'checkbox',
                checked: () => this.room.diagonalGrid
            }, {
                label: this.voc.changeGridSize,
                click: () => {
                    window.alertify
                    .confirm(this.voc.gridSize + `<br/><input type="number" value="${this.room.gridX}" style="width: 6rem;" min=2 id="theGridSizeX"> x <input type="number" value="${this.room.gridY}" style="width: 6rem;" min=2 id="theGridSizeY">`)
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            this.room.gridX = Number(document.getElementById('theGridSizeX').value);
                            this.room.gridY = Number(document.getElementById('theGridSizeY').value);
                        }
                        this.update();
                    });
                }
            }]
        };
        this.openGridMenu = e => {
            this.refs.gridMenu.popup(e.clientX, e.clientY);
        };

        this.zoomMenu = {
            opened: false,
            items: [...[12.5, 25, 50, 100, 200, 400, 800].map(zoom => ({
                label: `${zoom}%`,
                click: () => {
                    this.zoom = 1 / zoom * 100;
                    this.pixiEditor.zoomTo(zoom);
                }
            })), {
                type: 'separator'
            }, {
                label: this.voc.resetView,
                click: () => {
                    this.pixiEditor.goHome();
                },
                hotkeyLabel: 'H'
            }]
        };
        this.openZoomMenu = e => {
            this.refs.zoomMenu.popup(e.clientX, e.clientY);
        };

        const entityToIconMap = {
            copies: 'template',
            tiles: 'grid',
            backgrounds: 'image'
        };
        const entityVisibilityItems = [];
        for (const entityType in entityToIconMap) {
            entityVisibilityItems.push({
                label: this.voc[entityType],
                click: () => {
                    this.pixiEditor[entityType + 'Visible'] = !this.pixiEditor[entityType + 'Visible'];
                },
                type: 'checkbox',
                checked: () => this.pixiEditor[entityType + 'Visible']
            });
        }
        this.visibilityMenu = {
            opened: false,
            items: [
                ...entityVisibilityItems,
                {
                    type: 'separator'
                },
                {
                    label: this.voc.xrayMode,
                    click: () => {
                        this.pixiEditor.xrayMode = !this.pixiEditor.xrayMode;
                    },
                    type: 'checkbox',
                    checked: () => this.pixiEditor.xrayMode
                },
                {
                    label: this.voc.colorizeTileLayers,
                    click: () => {
                        this.pixiEditor.colorizeTileLayers = !this.pixiEditor.colorizeTileLayers;
                    },
                    type: 'checkbox',
                    checked: () => this.pixiEditor.colorizeTileLayers
                }
            ]
        };
        this.openVisibilityMenu = e => {
            this.refs.visibilityMenu.popup(e.clientX, e.clientY);
        };

        this.entitiesMenu = {
            opened: false,
            items: [{
                label: this.vocGlob.copy,
                click: () => {
                    this.pixiEditor.copySelection();
                },
                icon: 'copy',
                hotkeyLabel: 'Ctrl+C',
                if: () => this.pixiEditor.currentSelection.size
            }, {
                label: this.vocGlob.paste,
                click: () => {
                    this.pixiEditor.pasteSelection();
                },
                icon: 'clipboard',
                hotkeyLabel: 'Ctrl+V',
                if: () => this.pixiEditor.clipboard.size
            }, {
                type: 'separator',
                if: () => this.pixiEditor.currentSelection.size
            }, {
                label: this.voc.sortHorizontally,
                icon: 'sort-horizontal',
                click: () => {
                    this.pixiEditor.sort('x');
                }
            }, {
                label: this.voc.sortVertically,
                icon: 'sort-vertical',
                click: () => {
                    this.pixiEditor.sort('y');
                }
            }, {
                label: this.voc.sendToFront,
                icon: 'to-front',
                click: () => {
                    this.pixiEditor.sort('toFront');
                },
                if: () => this.pixiEditor.currentSelection.size
            }, {
                label: this.voc.sendToBack,
                icon: 'to-back',
                click: () => {
                    this.pixiEditor.sort('toBack');
                },
                if: () => this.pixiEditor.currentSelection.size
            }, {
                type: 'separator',
                if: () => this.pixiEditor.currentSelection.size
            }, {
                label: this.vocGlob.delete,
                click: () => {
                    this.pixiEditor.deleteSelected();
                },
                icon: 'trash',
                hotkeyLabel: 'Delete',
                if: () => this.pixiEditor.currentSelection.size
            }]
        };
        this.openMenus = e => {
            e.preventDefault();
            if (this.currentTool === 'select' || this.pixiEditor.clipboard.size) {
                this.refs.entitiesMenu.popup(e.clientX, e.clientY);
            }
        };

        this.editingEvents = false;
        this.openEventsList = () => {
            this.editingEvents = true;
        };
        this.closeRoomEvents = () => {
            this.editingEvents = false;
            this.update();
        };

        this.saveAsset = async () => {
            if (this.pixiEditor.currentSelection.size && this.refs.propertiesPanel) {
                this.refs.propertiesPanel.applyChanges();
            }
            this.pixiEditor.serialize();
            const {getStartingRoom} = require('src/lib/resources/rooms');
            const {RoomPreviewer} = require('src/lib/resources/preview/room');
            await RoomPreviewer.save(this.asset, this.asset.uid === getStartingRoom().uid);
            this.writeChanges();
        };
        this.saveRoom = async () => {
            await this.saveAsset();
            this.opts.ondone(this.asset);
        };

        const resizeEditor = () => {
            setTimeout(() => {
                this.pixiEditor.resize();
            }, 10);
        };
        const tabSwitchHandler = tab => {
            if (tab?.uid === this.asset.uid) {
                resizeEditor();
            }
        };
        const serialize = () => {
            this.pixiEditor.serialize();
        };
        this.on('mount', () => {
            window.signals.on('exportProject', serialize);
            window.signals.on('globalTabChanged', tabSwitchHandler);
        });
        this.on('unmount', () => {
            window.signals.off('exportProject', serialize);
            window.signals.off('globalTabChanged', tabSwitchHandler);
        });

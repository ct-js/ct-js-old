//-
    @attribute entitytype (resourceType)
    @attribute room (IRoom)
    @attribute editor (RoomEditor)
room-entities-list(onpointerout="{clearHover}")
    .pad
        .aSearchWrap.wide
            input.inline(type="text" onfocus="{selectAllSearch}" onkeyup="{updateSearch}")
            svg.feather
                use(xlink:href="#search")
    ul.aMenu.nmt(if="{opts.entitytype === 'copies'}")
        li(
            each="{copy, ind in opts.editor.copies}"
            if="{!searchQuery || copy.cachedTemplate.name.toLowerCase().includes(searchQuery)}"
            class="{active: parent.opts.editor.currentSelection.has(copy)}"
            onclick="{select}"
            onpointerenter="{drawHover}"
        )
            img.room-entities-list-aThumbnail(src="{getThumbnail(copy.cachedTemplate)}")
            span {copy.cachedTemplate.name}
            |
            |
            span.small.dim \#{copy.id}
    ul.aMenu(if="{opts.entitytype === 'tiles'}")
        li(
            each="{tile, ind in tilesEntries}"
            if="{!searchQuery || getById('texture', tile.tileTexture).name.toLowerCase().includes(searchQuery)}"
            class="{active: parent.opts.editor.currentSelection.has(tile)}"
            onclick="{select}"
            onpointerenter="{drawHover}"
        )
            img.room-entities-list-aThumbnail(
                if="{tilesEntries.length <= 500}"
                src="{getThumbnail(getById('texture', tile.tileTexture))}"
            )
            span {getById('texture', tile.tileTexture).name}
            |
            |
            span @{tile.tileFrame}
            |
            |
            span.small.dim \#{tile.id}
    script.
        const {getThumbnail, getById} = require('src/lib/resources');
        this.getThumbnail = getThumbnail;
        this.getById = getById;

        let lastSelected;
        this.select = e => {
            this.opts.editor.tryApplyProperties();
            const {copy, tile, ind} = e.item;
            const object = copy ?? tile;
            const set = this.opts.editor.currentSelection;
            if (e.ctrlKey) {
                // Toggle selection
                if (set.has(object)) {
                    set.delete(object);
                } else {
                    set.add(object);
                }
            } else if (e.shiftKey) {
                // Add a range of objects to selection
                if (lastSelected) {
                    let array;
                    if (copy) {
                        array = this.opts.editor.copies;
                    } else if (tile) {
                        array = this.tilesEntries;
                    }
                    const ind2 = array.indexOf(lastSelected),
                          from = Math.min(ind, ind2),
                          to = Math.max(ind, ind2);
                    // Split code for faster selection when no search query is specified
                    if (!this.searchQuery) {
                        for (const rangeObj of array.slice(from, to)) {
                            set.add(rangeObj);
                        }
                    } else if (tile) {
                        for (const rangeObj of array.slice(from, to)) {
                            if (getById('texture', rangeObj.tileTexture).name.toLowerCase().includes(this.searchQuery)) {
                                set.add(rangeObj);
                            }
                        }
                    } else if (copy) {
                        for (const rangeObj of array.slice(from, to)) {
                            if (rangeObj.cachedTemplate.name.toLowerCase().includes(this.searchQuery)) {
                                set.add(rangeObj);
                            }
                        }
                    }
                }
                set.add(object);
            } else {
                // Override selection
                set.clear();
                set.add(object);
            }
            lastSelected = object;
            this.opts.editor.prepareSelection();
        };
        this.drawHover = e => {
            const {copy, tile} = e.item;
            this.opts.editor.setHoverSelection(copy ?? tile);
            e.preventUpdate = true;
        };
        this.clearHover = e => {
            e.preventUpdate = true;
            if (e.target !== this.root) {
                return;
            }
            this.opts.editor.clearSelectionOverlay(true);
            this.resetLastSelected();
        };

        // Cache the result of RoomEditor.tiles.entries()
        let lastMode = this.opts.entitytype;
        this.updateTileEntries = () => {
            this.tilesEntries = [...this.opts.editor.tiles];
        };
        this.on('update', () => {
            // Update tile cache when switching modes
            if (lastMode !== this.opts.entitytype) {
                lastSelected = void 0;
                lastMode = this.opts.entitytype;
                if (this.opts.entitytype === 'tiles') {
                    this.updateTileEntries();
                }
            }
        });
        this.updateTileEntries();

        this.resetLastSelected = () => {
            lastSelected = void 0;
        };

        this.selectAllSearch = e => {
            e.target.select();
        };
        this.updateSearch = e => {
            this.searchQuery = e.target.value.trim().toLowerCase();
        };

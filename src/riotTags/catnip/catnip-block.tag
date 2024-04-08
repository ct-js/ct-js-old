//-
    @attribute block (IBlock)
        The block from the block script that is rendered
    @atribute [nodrag] (atomic)
        Prohibits dragging this block
    @attribute [readonly] (atomic)
        Prohibits editing this block and all its nested blocks

catnip-block(
    draggable="{!opts.nodrag}"
    class="{error: !declaration} {declaration.type} {declaration.typeHint} {opts.class} {declaration.customClass}"
    hide="{getHidden}"
    title="{declaration.documentation}"
)
    svg.feather(if="{!declaration}")
        use(xlink:href="#x")
    span(if="{!declaration}") {voc.errorBlock} "{opts.block.lib}" — {opts.block.code}. {voc.errorBlockDeleteHint}

    svg.feather(if="{declaration && declaration.icon && !declaration.hideIcon}")
        use(xlink:href="#{declaration.icon}")
    span.catnip-block-aTextLabel(if="{declaration && !declaration.hideLabel}")
        | {(voc.blockDisplayNames[declaration.displayI18nKey] || localizeField(declaration, 'displayName')) || (voc.blockNames[declaration.i18nKey] || localizeField(declaration, 'name'))}
    virtual(each="{piece in declaration.pieces}" if="{declaration}")
        span.catnip-block-aTextLabel(if="{piece.type === 'label'}") {voc.blockLabels[piece.i18nKey]  || localizeField(piece, 'name')}
        span.catnip-block-aTextLabel(if="{piece.type === 'propVar'}") {parent.opts.block.values.variableName}
        svg.feather(if="{piece.type === 'icon'}")
            use(xlink:href="#{piece.icon}")
        span.catnip-block-anAsyncMarker(if="{piece.type === 'asyncMarker'}" title="{voc.asyncHint}")
            svg.feather
                use(xlink:href="#clock")
        .catnip-block-aFiller(if="{piece.type === 'filler'}")
        .catnip-block-aBreak(if="{piece.type === 'break'}")
        textarea.code(
            readonly="{opts.readonly}"
            if="{piece.type === 'code'}"
            ref="codeEditor"
            value="{getValue(piece.key)}"
            placeholder="{piece.key}"
        )
        textarea(
            readonly="{opts.readonly}"
            if="{piece.type === 'textbox'}"
            value="{getValue(piece.key)}"
            placeholder="{piece.key}"
        )
        .catnip-block-Blocks(if="{piece.type === 'blocks'}" ref="blocksDrop")
            catnip-block-list(
                blocks="{getValue(piece.key)}"
                showplaceholder="showplaceholder"
                placeholder="{piece.placeholder}"
                readonly="{parent.opts.readonly}"
            )
        // Options
        .catnip-block-Options(if="{piece.type === 'options'}")
            .catnip-block-anOptionsToggle(onclick="{toggleShowOptions}")
                svg.feather
                    use(xlink:href="#chevron-{openOptions ? 'up' : 'down'}")
                span {voc.optionsAdvanced}
                svg.feather
                    use(xlink:href="#chevron-{openOptions ? 'up' : 'down'}")
            dl(if="{openOptions}" each="{option in piece.options}")
                dt {voc.blockOptions[option.i18nKey] || option.name || option.key}
                dd
                    catnip-block(
                        if="{getValue(option.key) && (typeof getValue(option.key)) === 'object'}"
                        class="{option.typeHint}"
                        block="{getValue(option.key)}"
                        readonly="{parent.parent.opts.readonly}"
                        ondragstart="{parent.onDragStart}"
                        ondragend="{parent.onDragEnd}"
                        oncontextmenu="{parent.onContextMenu}"
                        onclick="{parent.tryMutate}"
                    )
                    input.catnip-block-aConstantInput(
                        ondrop="{parent.onDrop}"
                        ondragenter="{parent.handlePreDrop}"
                        ondragstart="{parent.handlePreDrop}"
                        onclick="{parent.tryAddBoolean}"
                        type="text" value="{parent.getValue(option.key)}"
                        oninput="{parent.writeConstantVal}"
                        placeholder="{option.key}"
                        if="{!option.assets && (!getValue(option.key) || (typeof getValue(option.key)) !== 'object')}"
                        class="{option.typeHint}"
                        readonly="{parent.parent.opts.readonly}"
                        style="width: {getValue(option.key) ? Math.min((''+getValue(option.key)).length + 0.5, 32) : option.key.length + 0.5}ch"
                    )
                    span.catnip-block-aConstantInput.menu(
                        ondrop="{parent.onDrop}"
                        ondragenter="{parent.handlePreDrop}"
                        ondragstart="{parent.handlePreDrop}"
                        if="{option.assets && (!getValue(option.key) || (typeof getValue(option.key)) !== 'object')}"
                        class="{option.typeHint}"
                        onclick="{!parent.parent.opts.readonly && promptAsset}"
                    )
                        svg.feather(if="{!getValue(option.key)}")
                            use(xlink:href="#search")
                        span(if="{!getValue(option.key)}") {vocGlob.selectDialogue}
                        svg.feather(if="{getValue(option.key) && option.assets === 'action'}")
                            use(xlink:href="#airplay")
                        svg.feather(if="{getValue(option.key) && option.assets !== 'action' && areThumbnailsIcons(option.assets)}")
                            use(xlink:href="#{getThumbnail(option.assets, getValue(option.key))}")
                        img(
                            if="{getValue(option.key) && option.assets !== 'action' && !areThumbnailsIcons(option.assets)}"
                            src="{getThumbnail(option.assets, getValue(option.key))}"
                            class="{soundthumbnail: option.assets === 'sound'}"
                        )
                        span(if="{getValue(option.key) && option.assets !== 'action'}") {getName(option.assets, getValue(option.key))}
                        span(if="{getValue(option.key) && option.assets === 'action'}") {getValue(option.key)}
            // User-defined options
            dl(if="{openOptions && piece.allowCustom && parent.opts.block.customOptions}" each="{value, key in parent.opts.block.customOptions}")
                dt
                    input.catnip-block-aConstantInput.string(
                        type="text" value="{key}"
                        onchange="{parent.writeOptionKey}"
                        readonly="{parent.parent.opts.readonly}"
                        style="width: {Math.min(key.length + 0.5, 32)}ch"
                    )
                dd
                    catnip-block(
                        if="{getCustomValue(key) && (typeof getCustomValue(key)) === 'object'}"
                        block="{getCustomValue(key)}"
                        readonly="{parent.parent.opts.readonly}"
                        ondragstart="{parent.onOptionDragStart}"
                        ondragend="{parent.onOptionDragEnd}"
                        oncontextmenu="{parent.onOptionContextMenu}"
                        onclick="{parent.tryMutateCustomOption}"
                    )
                    input.catnip-block-aConstantInput.wildcard(
                        ondrop="{parent.onOptionDrop}"
                        ondragenter="{parent.handlePreDrop}"
                        ondragstart="{parent.handlePreDrop}"
                        type="text" value="{value}"
                        onchange="{parent.writeOption}"
                        placeholder="{key}"
                        if="{!value || typeof value !== 'object'}"
                        readonly="{parent.parent.opts.readonly}"
                        style="width: {Math.min(value ? value.length + 0.5 : 5, 32)}ch"
                    )
            .pad(if="{openOptions && piece.allowCustom}")
                button.inline.small(onclick="{addCustomOption}")
                    svg.feather
                        use(xlink:href="#plus")
                    span {voc.addCustomOption}
        // Arguments
        catnip-block(
            if="{piece.type === 'argument' && getValue(piece.key) && (typeof getValue(piece.key)) === 'object'}"
            class="{piece.typeHint}"
            block="{getValue(piece.key)}"
            readonly="{parent.opts.readonly}"
            ondragstart="{parent.onDragStart}"
            ondragend="{parent.onDragEnd}"
            oncontextmenu="{parent.onContextMenu}"
            onclick="{parent.tryMutate}"
        )
        input.catnip-block-aConstantInput(
            ondrop="{parent.onDrop}"
            ondragenter="{parent.handlePreDrop}"
            ondragstart="{parent.handlePreDrop}"
            type="text" value="{parent.getValue(piece.key)}"
            oninput="{parent.writeConstantVal}"
            onclick="{tryColorPicker}"
            placeholder="{piece.key}"
            if="{piece.type === 'argument' && !piece.assets && (!getValue(piece.key) || (typeof getValue(piece.key)) !== 'object')}"
            class="{piece.typeHint}"
            readonly="{parent.opts.readonly}"
            style="\
                width: {getValue(piece.key) ? Math.min((''+getValue(piece.key)).length + 0.5, 32) : piece.key.length + 0.5}ch;\
                {(piece.typeHint === 'color' && getValue(piece.key)) ? 'background-color: ' + getValue(piece.key) + ';' : ''}\
                {(piece.typeHint === 'color' && getValue(piece.key)) ? 'border-color: ' + getValue(piece.key) + ';' : ''}\
                {(piece.typeHint === 'color' && getValue(piece.key)) ? 'color: ' + (brehautColor(getValue(piece.key)).getLightness() > 0.5 ? 'black' : 'white') + ';' : ''}\
            "
        )
        span.catnip-block-aConstantInput.menu(
            ondrop="{parent.onDrop}"
            ondragenter="{parent.handlePreDrop}"
            ondragstart="{parent.handlePreDrop}"
            if="{piece.type === 'argument' && piece.assets && (!getValue(piece.key) || (typeof getValue(piece.key)) !== 'object')}"
            class="{piece.typeHint}"
            onclick="{!parent.opts.readonly && promptAsset}"
        )
            svg.feather(if="{!getValue(piece.key)}")
                use(xlink:href="#search")
            span(if="{!getValue(piece.key)}") {vocGlob.selectDialogue}
            svg.feather(if="{getValue(piece.key) && piece.assets === 'action'}")
                use(xlink:href="#airplay")
            svg.feather(if="{getValue(piece.key) && piece.assets !== 'action' && areThumbnailsIcons(piece.assets)}")
                use(xlink:href="#{getThumbnail(piece.assets, getValue(piece.key))}")
            img(
                if="{getValue(piece.key) && piece.assets !== 'action' && !areThumbnailsIcons(piece.assets)}"
                src="{getThumbnail(piece.assets, getValue(piece.key))}"
                class="{soundthumbnail: piece.assets === 'sound'}"
            )
            span(if="{getValue(piece.key) && piece.assets !== 'action'}") {getName(piece.assets, getValue(piece.key))}
            span(if="{getValue(piece.key) && piece.assets === 'action'}") {getValue(piece.key)}
    context-menu(draggable="true" ondragstart="{preventDrag}" if="{contextPiece || contextOption}" menu="{contextMenu}" ref="menu")
    context-menu(draggable="true" ondragstart="{preventDrag}" if="{selectingAction}" menu="{actionsMenu}" ref="actionsmenu")
    asset-selector(
        draggable="true" ondragstart="{preventDrag}"
        if="{selectingAssetType}"
        assettypes="{selectingAssetType}"
        onselected="{selectAsset}"
        oncancelled="{cancelAssetSelection}"
    )
    .aDimmer(if="{colorValue}" draggable="true" ondragstart="{preventDrag}")
        color-picker(
            hidealpha="hidealpha"
            onapply="{applyColorValue}"
            oncancel="{closeColorPicker}"
            color="{opts.block.values[colorValue]}"
        )
    script.
        this.namespace = 'catnip';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        const {getDeclaration, getTransmissionType, getTransmissionReturnVal, startBlocksTransmit, endBlocksTransmit, setSuggestedTarget, emptyTexture} = require('./data/node_requires/catnip');
        const {getName, getById, areThumbnailsIcons, getThumbnail} = require('./data/node_requires/resources');
        this.getName = (assetType, id) => getName(getById(assetType, id));
        this.areThumbnailsIcons = areThumbnailsIcons;
        this.getThumbnail = (assetType, id) => getThumbnail(getById(assetType, id), false, false);
        this.localizeField = require('./data/node_requires/i18n').localizeField;

        try {
            this.declaration = getDeclaration(this.opts.block.lib, this.opts.block.code);
        } catch (e) {
            console.error(e);
            this.declaration = false;
        }
        this.getValue = key => this.opts.block.values[key];
        this.getCustomValue = key => this.opts.block.customOptions[key];
        // A random ID that is used during block tree traversal
        // to prevent putting a block into itself or its children.
        this.id = require('./data/node_requires/generateGUID')();

        this.dragging = false;

        this.getHidden = () => this.dragging;

        this.onDragStart = e => {
            this.update();
            const sourcePiece = e.item.option || e.item.piece;
            let block;
            try { // Prevent dragging broken blocks
                block = this.opts.block.values[sourcePiece.key];
                getDeclaration(block.lib, block.code);
            } catch (oO) {
                e.stopPropagation();
                e.preventDefault();
                e.preventUpdate = true;
                return;
            }
            e.dataTransfer.setData('ctjsblocks/computed', 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            const bounds = e.target.getBoundingClientRect();
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
            startBlocksTransmit(
                [this.opts.block.values[sourcePiece.key]],
                this.opts.block.values, sourcePiece.key
            );
            e.stopPropagation();
            this.hoveredOver = null;
        };
        this.onDragEnd = () => {
            setSuggestedTarget();
        };

        this.writeConstantVal = e => {
            const piece = e.item.option || e.item.piece;
            let val = e.target.value;
            if (piece.typeHint === 'number') {
                val = Number(e.target.value) || 0;
            } else if (piece.typeHint === 'boolean') {
                val = val.trim() === 'true';
            } else if (piece.typeHint === 'wildcard' && Number.isFinite(Number(e.target.value))) {
                val = Number(e.target.value);
            }
            this.opts.block.values[piece.key] = val;
        };
        // Clicking on empty boolean fields automatically puts a constant boolean
        this.tryAddBoolean = e => {
            e.stopPropagation();
            const piece = e.item.option || e.item.piece;
            if (piece.typeHint === 'boolean') {
                this.opts.block.values[piece.key] = {
                    lib: 'core.logic',
                    code: 'true',
                    values: {}
                };
            } else {
                e.preventUpdate = false;
            }
        };
        // Mutating on click
        this.tryMutate = e => {
            e.stopPropagation();
            const piece = e.item.option || e.item.piece;
            const targetBlock = this.opts.block.values[piece.key];
            const blockDeclaration = getDeclaration(targetBlock.lib, targetBlock.code);
            if (blockDeclaration.onClickMutator) {
                const {lib, code} = blockDeclaration.onClickMutator;
                const {values} = targetBlock;
                // Requires an update or riot.js ignores the object's key change, for some reason.
                this.opts.block.values[piece.key] = void 0;
                this.update();
                this.opts.block.values[piece.key] = {
                    lib,
                    code,
                    values
                };
            } else {
                e.preventUpdate = true;
            }
        };
        this.tryMutateCustomOption = e => {
            const {value, key} = e.item;
            const blockDeclaration = getDeclaration(value.lib, value.code);
            if (blockDeclaration.onClickMutator) {
                const {lib, code} = blockDeclaration.onClickMutator;
                const {values} = value;
                // Requires an update or riot.js ignores the object's key change, for some reason.
                this.opts.block.customOptions[key] = void 0;
                this.update();
                this.opts.block.customOptions[key] = {
                    lib,
                    code,
                    values
                };
            } else {
                e.preventUpdate = true;
            }
        };

        const isInvalidDrop = e =>
            this.opts.readonly || !e.dataTransfer.types.includes('ctjsblocks/computed');
        this.handlePreDrop = e => {
            if (!isInvalidDrop(e)) {
                e.preventUpdate = true;
                e.preventDefault(); // Tells that we do want to accept the drop
            }
        };
        this.onDrop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            // Disallow commands
            if (getTransmissionType() !== 'computed') {
                e.preventUpdate = true;
                return;
            }
            const piece = e.item.option || e.item.piece;

            // Disallow non-matching types
            if (piece.typeHint !== 'wildcard' &&
                getTransmissionReturnVal() !== 'wildcard' &&
                piece.typeHint !== getTransmissionReturnVal()
            ) {
                e.preventUpdate = true;
                return;
            }
            this.hoveredOver = null;
            e.preventDefault();
            e.stopPropagation();
            endBlocksTransmit(this.opts.block.values, piece.key);
        };


        this.contextPiece = this.contextOption = false;
        this.onContextMenu = e => {
            if (this.opts.readonly) {
                e.preventUpdate = true;
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const piece = e.item.option || e.item.piece;
            this.contextPiece = piece;
            this.update();
            this.refs.menu.popup(e.clientX, e.clientY);
        };
        this.onOptionContextMenu = e => {
            if (this.opts.readonly) {
                e.preventUpdate = true;
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            this.contextOption = e.item.key;
            this.update();
            this.refs.menu.popup(e.clientX, e.clientY);
        };
        const deleteMenuItem = {
            label: this.vocGlob.delete,
            icon: 'trash',
            click: () => {
                if (this.contextOption) {
                    this.opts.block.customOptions[this.contextOption] = void 0;
                    this.contextOption = false;
                } else {
                    delete this.opts.block.values[this.contextPiece.key];
                    this.contextPiece = false;
                }
                this.update();
            }
        };
        this.contextMenu = {
            opened: true,
            items: [deleteMenuItem]
        };

        // Arguments with `assets` field
        this.selectingAssetType = this.selectingAssetPiece = false;
        this.promptAsset = e => {
            const {piece} = e.item;
            if (piece.assets === 'action') {
                this.selectingAction = true;
                this.actionsMenu = {
                    opened: true,
                    items: window.currentProject.actions.map(action => ({
                        label: action.name,
                        icon: 'airplay',
                        click: () => {
                            this.opts.block.values[piece.key] = action.name;
                            this.update();
                            this.selectingAction = false;
                        }
                    }))
                };
                this.update();
                this.refs.actionsmenu.popup(e.clientX, e.clientY);
            } else {
                this.selectingAssetType = piece.assets;
                this.selectingAssetPiece = piece;
            }
        };
        this.selectAsset = id => {
            this.opts.block.values[this.selectingAssetPiece.key] = id;
            this.selectingAssetType = this.selectingAssetPiece = false;
            this.update();
        };
        this.cancelAssetSelection = () => {
            this.selectingAssetType = this.selectingAssetPiece = false;
            this.update();
        };

        // Tags with advanced options
        this.openOptions = false;
        this.toggleShowOptions = () => {
            this.openOptions = !this.openOptions;
        };

        // User-defined advanced options
        this.addCustomOption = () => {
            if (!this.opts.block.customOptions) {
                this.opts.block.customOptions = {};
            }
            let namePostfix = 0;
            while (`key${namePostfix}` in this.opts.block.customOptions) {
                namePostfix++;
            }
            this.opts.block.customOptions[`key${namePostfix}`] = '';
        };
        this.writeOptionKey = e => {
            const oldKey = e.item.key,
                  oldVal = this.opts.block.customOptions[oldKey];
            const newKey = e.target.value.trim();
            delete this.opts.block.customOptions[oldKey];
            this.opts.block.customOptions[newKey] = oldVal;
        };
        this.writeOption = e => {
            const {key} = e.item;
            this.opts.block.customOptions[key] = e.target.value.trim();
        };
        this.onOptionDragStart = e => {
            let block;
            try { // Prevent dragging broken blocks
                block = this.opts.block.customOptions[e.item.key];
                getDeclaration(block.lib, block.code);
            } catch (oO) {
                e.stopPropagation();
                e.preventDefault();
                e.preventUpdate = true;
                return;
            }
            e.dataTransfer.setData('ctjsblocks/computed', 'hello uwu');
            e.dataTransfer.setDragImage(emptyTexture, 0, 0);
            const bounds = e.target.getBoundingClientRect();
            window.signals.trigger(
                'blockTransmissionStart',
                e,
                e.target.outerHTML,
                bounds.left - e.clientX,
                bounds.top - e.clientY
            );
            startBlocksTransmit(
                [this.opts.block.customOptions[e.item.key]],
                this.opts.block.customOptions,
                e.item.key,
                true
            );
            e.stopPropagation();
            this.hoveredOver = null;
        };
        this.onOptionDrop = e => {
            if (isInvalidDrop(e)) {
                e.preventUpdate = true;
                return;
            }
            // Disallow commands
            if (getTransmissionType() !== 'computed') {
                e.preventUpdate = true;
                return;
            }
            this.hoveredOver = null;
            e.preventDefault();
            e.stopPropagation();
            endBlocksTransmit(this.opts.block.customOptions, e.item.key);
        };
        // Do not delete the property when moving a block out, recreate the property
        this.onOptionDragEnd = e => {
            setSuggestedTarget();
            this.opts.block.customOptions[e.item.key] = '';
        };

        // Color inputs
        this.colorValue = false;
        this.applyColorValue = color => {
            this.opts.block.values[this.colorValue] = color;
            this.closeColorPicker();
        };
        this.closeColorPicker = () => {
            this.colorValue = false;
            this.update();
        };
        this.tryColorPicker = e => {
            const {piece} = e.item;
            if (piece.typeHint === 'color') {
                e.target.blur();
                this.colorValue = piece.key;
            } else {
                this.tryAddBoolean(e);
            }
        };

        this.preventDrag = e => {
            e.stopPropagation();
            e.preventDefault();
            e.preventUpdate = true;
        };
/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {usableDeclaration} from './declarationExtractor';

const specials = /[_.]/g;
const camels = /(\w)([A-Z])/g;
export const niceBlockName = (name: string, lowercase?: boolean): string => {
    name = name.replace(specials, ' ')
               .replace(camels, val => `${val[0]} ${val[1].toLocaleLowerCase()}`);
    if (!lowercase) {
        return name.charAt(0).toLocaleUpperCase() + name.slice(1);
    }
    return name;
};

const sortHelper = {
    command: -1,
    computed: 1
};

const supportedTypes = ['string', 'number', 'boolean', 'wildcard', 'function'];

const getPieces = (piecesAssets: Record<string, resourceType | 'action'>, useful: usableDeclaration): (IBlockPieceArgument | IBlockPieceBlocks)[] =>
    (useful.kind === 'function' ? useful.args : []).map(arg => {
        if (arg.type === 'BLOCKS') {
            return {
                type: 'blocks',
                key: arg.name
            };
        }
        return {
            type: 'argument' as const,
            key: arg.name,
            typeHint: supportedTypes.includes(arg.type) ? arg.type : 'wildcard',
            assets: piecesAssets[arg.name],
            required: arg.required
        };
    });

const stringifyArg = (values: Record<string, string>) => (arg: {
    type: blockArgumentType | 'BLOCKS';
    name: string;
}) => {
    if (arg.type === 'BLOCKS') {
        return `function () {\n    ${values[arg.name]}\n}`;
    }
    return values[arg.name];
};

export const convertFromDtsToBlocks = (usefuls: usableDeclaration[], lib: 'core' | string, icon?: string):
(IBlockCommandDeclaration | IBlockComputedDeclaration)[] => {
    const knownCodes = new Set<string>();
    const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [];
    // eslint-disable-next-line no-labels
    onusefulLoop: for (const useful of usefuls) {
        if (knownCodes.has(useful.name)) {
            continue; // Skip duplicates (these usually happen due to several methods' overloads)
        } else {
            knownCodes.add(useful.name);
        }
        let documentation = useful.description,
            name = niceBlockName(useful.name),
            displayName: string | undefined;
        const piecesAssets: Record<string, resourceType | 'action'> = {};
        const piecesDefaults: Record<string, string | number | boolean> = {};
        const extraNames: Record<string, string> = {};
        let returnSave = false,
            promise: false | 'both' | 'catch' | 'then' = false,
            promiseSave: blockArgumentType | false = false,
            listType: resourceType | false = false;
        if (useful.jsDoc) {
            for (const jsDoc of useful.jsDoc) {
                if (!jsDoc.tags) {
                    continue;
                }
                documentation += '\n';
                // Parse supported tags in JSDoc
                for (const node of jsDoc.tags) {
                    if (node.tagName.escapedText === 'param') {
                        documentation += `\n**${(node as any).name.escapedText}** ${node.comment}`;
                    } else if (node.tagName.escapedText === 'returns' || node.tagName.escapedText === 'return') {
                        documentation += `\n\n**Returns** ${node.comment}`;
                    } else if (node.tagName.escapedText === 'catnipIgnore') {
                        // Hides this block from Catnip
                        // eslint-disable-next-line no-labels
                        continue onusefulLoop;
                    } else if (node.tagName.escapedText === 'catnipLabel' && node.comment) {
                        // Defines a custom display name for this block
                        displayName = node.comment?.toString();
                    } else if (node.tagName.escapedText === 'catnipName' && node.comment) {
                        // Defines a custom name for this block
                        name = node.comment.toString();
                    } else if (String(node.tagName.escapedText).startsWith('catnipName_') && node.comment) {
                        // Localized names for this block
                        const key = String(node.tagName.escapedText).replace('catnipName_', 'name_'),
                              displayNameKey = String(node.tagName.escapedText).replace('catnipName_', 'displayName_');
                        extraNames[key] = node.comment.toString().trim();
                        if (!extraNames[displayNameKey]) {
                            extraNames[displayNameKey] = extraNames[key];
                        }
                    } else if (String(node.tagName.escapedText).startsWith('catnipLabel_') && node.comment) {
                        // Localized display names for this block
                        const key = String(node.tagName.escapedText).replace('catnipLabel_', 'displayName_');
                        extraNames[key] = node.comment.toString().trim();
                    } else if (node.tagName.escapedText === 'catnipIcon' && node.comment) {
                        // Sets a different icon to this block
                        icon = node.comment.toString();
                    } else if (node.tagName.escapedText === 'catnipAsset' && node.comment) {
                        // Replaces this param with an asset picker of the specified type.
                        // The format is `@catnipAsset <key>:<assetType>`
                        // Can only specify one key-format pair, but the tag itself can be repeated.
                        let [key, assetType] = node.comment.toString().split(':');
                        key = key.trim();
                        assetType = assetType.trim();
                        piecesAssets[key] = assetType as resourceType | 'action';
                    } else if (node.tagName.escapedText === 'catnipDefault' && node.comment) {
                        // Defines a default value for the specified param.
                        let [key, value] = node.comment.toString().split(':');
                        key = key.trim();
                        value = value.trim();
                        if (isFinite(Number(value))) {
                            piecesDefaults[key] = Number(value);
                        } else if (value === 'true') {
                            piecesDefaults[key] = true;
                        } else if (value === 'false') {
                            piecesDefaults[key] = false;
                        } else {
                            piecesDefaults[key] = value;
                        }
                    } else if (node.tagName.escapedText === 'catnipList' && node.comment) {
                        // Replaces this param with an asset picker.
                        // Used for dictionaries of arrays like `templates.list`.
                        listType = node.comment.toString().trim() as resourceType;
                        icon = 'grid';
                    } else if (node.tagName.escapedText === 'catnipSaveReturn') {
                        // Adds a slot to the right side of the block so the user can save
                        // the return value of the block.
                        returnSave = true;
                    } else if (node.tagName.escapedText === 'catnipPromise') {
                        // Adds slots for blocks to add promise handlers
                        // to the block's return value.
                        // The keyword after `@catnipPromise` can be `then`, `catch`, or `both`.
                        // It defines which handlers will appear, and it defaults to `both`.
                        const raw = node.comment?.toString().trim();
                        if (raw === 'catch') {
                            promise = 'catch';
                        } else if (raw === 'then') {
                            promise = 'then';
                        } else {
                            promise = 'both';
                        }
                    } else if (node.tagName.escapedText === 'catnipPromiseSave' && node.comment) {
                        // Adds a slot to the right side of the block so the user can use
                        // the resolved value of a promise.
                        promiseSave = node.comment.toString().trim() as blockArgumentType || 'wildcard';
                    }
                }
            }
        }
        let isCommand = useful.kind === 'function' && (!useful.returnType || useful.returnType === 'void');
        if (returnSave || promise) {
            isCommand = true;
        }
        if (!displayName) {
            displayName = name;
        }
        const draft = {
            code: useful.name,
            lib,
            type: isCommand ? 'command' : 'computed',
            typeHint: useful.returnType,
            name: isCommand ? name.slice(0, 1).toUpperCase() + name.slice(1) : name.toLowerCase(),
            displayName: displayName && (isCommand ?
                displayName.slice(0, 1).toUpperCase() + displayName.slice(1) :
                displayName.toLowerCase()),
            ...extraNames,
            documentation,
            pieces: getPieces(piecesAssets, useful)
        } as Omit<IBlockComputedDeclaration, 'jsTemplate'> & Partial<Pick<IBlockComputedDeclaration, 'jsTemplate'>>;
        if (icon) {
            draft.icon = icon;
        }
        if (listType) {
            draft.pieces.push({
                type: 'argument',
                key: 'list',
                typeHint: 'wildcard',
                assets: listType
            });
        }
        if (returnSave || promiseSave) {
            draft.pieces.push({
                type: 'filler'
            }, {
                type: 'label',
                name: 'store in',
                i18nKey: 'store in'
            }, {
                type: 'argument',
                key: 'return',
                typeHint: promiseSave || 'wildcard'
            });
            if (promiseSave) {
                draft.pieces.push({
                    type: 'asyncMarker'
                });
            }
        } else if (promise) {
            draft.pieces.push({
                type: 'filler'
            }, {
                type: 'asyncMarker'
            });
        }
        if (promise) {
            if (promise === 'then' || promise === 'both') {
                draft.pieces.push({
                    type: 'break'
                }, {
                    type: 'icon',
                    icon: 'redo'
                }, {
                    type: 'label',
                    name: 'then',
                    i18nKey: 'then'
                }, {
                    type: 'blocks',
                    placeholder: 'doNothing',
                    key: 'then'
                });
            }
            if (promise === 'catch' || promise === 'both') {
                draft.pieces.push({
                    type: 'break'
                }, {
                    type: 'icon',
                    icon: 'alert-octagon'
                }, {
                    type: 'label',
                    name: 'catch',
                    i18nKey: 'catch'
                }, {
                    type: 'blocks',
                    placeholder: 'doNothing',
                    key: 'catch'
                });
            }
        }
        if (useful.kind === 'prop') {
            if (listType) {
                draft.jsTemplate = vals => `${useful.name}[${vals.list}]`;
            } else {
                draft.jsTemplate = () => useful.name;
            }
        } else {
            const {name, args} = useful;
            if (returnSave) {
                draft.jsTemplate = values => {
                    if (values.return && values.return !== 'undefined') {
                        return `${values.return} = ${name}(${args.map(stringifyArg(values)).join(', ')});`;
                    }
                    return `${name}(${args.map(stringifyArg(values)).join(', ')});`;
                };
            } else if (promise) {
                if (promise === 'catch') {
                    draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                    .catch(() => {
                        ${values.catch}
                    });`;
                } else if (promise === 'then') {
                    if (promiseSave) {
                        draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                        .then(val => {
                            ${values.return} = val;
                            ${values.then}
                        });`;
                    } else {
                        draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                        .then(() => {
                            ${values.then}
                        });`;
                    }
                } else if (promiseSave) { // promise === 'both'
                    draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                    .then(val => {
                        ${values.return} = val;
                        ${values.then}
                    }).catch(() => {
                        ${values.catch}
                    });`;
                } else {
                    draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})
                    .then(() => {
                        ${values.then}
                    }).catch(() => {
                        ${values.catch}
                    });`;
                }
            } else if (isCommand) {
                draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')});`;
            } else {
                draft.jsTemplate = values => `${name}(${args.map(stringifyArg(values)).join(', ')})`;
            }
        }
        blocks.push(draft as IBlockComputedDeclaration | IBlockCommandDeclaration);
    }
    blocks.sort((a, b) => sortHelper[a.type] - sortHelper[b.type]);
    return blocks;
};

import {makeMutators} from './_utils';

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'If branch',
    displayName: 'If',
    type: 'command',
    code: 'if branch',
    icon: 'help-circle',
    jsTemplate: (args) =>
        `if (${args.condition}) {\n    ${args.body1}\n}`,
    lib: 'core.logic',
    i18nKey: 'if branch',
    displayI18nKey: 'if else branch',
    pieces: [{
        type: 'argument',
        key: 'condition',
        typeHint: 'boolean',
        required: true
    }, {
        placeholder: 'doNothing',
        type: 'blocks',
        key: 'body1'
    }],
    mutators: [{
        code: 'if else branch',
        lib: 'core.logic'
    }]
}, {
    name: 'If else branch',
    displayName: 'If',
    type: 'command',
    code: 'if else branch',
    icon: 'help-circle',
    jsTemplate: (args) =>
        `if (${args.condition}) {\n    ${args.body1}\n} else {\n    ${args.body2}\n}`,
    lib: 'core.logic',
    i18nKey: 'if else branch',
    displayI18nKey: 'if else branch',
    pieces: [{
        type: 'argument',
        key: 'condition',
        typeHint: 'boolean',
        required: true
    }, {
        placeholder: 'doNothing',
        type: 'blocks',
        key: 'body1'
    }, {
        type: 'icon',
        icon: 'alert-circle'
    }, {
        type: 'label',
        name: 'else',
        i18nKey: 'else'
    }, {
        placeholder: 'doNothing',
        type: 'blocks',
        key: 'body2'
    }],
    mutators: [{
        code: 'if branch',
        lib: 'core.logic'
    }]
}, {
    name: 'While loop cycle',
    displayName: 'While',
    type: 'command',
    code: 'while loop cycle',
    icon: 'rotate-cw',
    jsTemplate: (args) => `while (${args.condition}) {\n    ${args.body}\n}`,
    lib: 'core.logic',
    i18nKey: 'while loop cycle',
    displayI18nKey: 'while loop cycle',
    pieces: [{
        type: 'argument',
        key: 'condition',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'blocks',
        key: 'body'
    }]
}, {
    name: 'Repeat N times',
    displayName: 'Repeat',
    type: 'command',
    code: 'repeat',
    icon: 'rotate-cw',
    jsTemplate: (args, safeId) => {
        if (args.variableName) {
            return `for (${args.variableName} = 0; ${args.variableName} < ${args.N}; ${args.variableName}++) {\n    ${args.body}\n}`;
        }
        return `for (i${safeId} = 0; i${safeId} < ${args.N}; i${safeId}++) {\n    ${args.body}\n}`;
    },
    lib: 'core.logic',
    i18nKey: 'repeat',
    displayI18nKey: 'repeat',
    pieces: [{
        type: 'argument',
        key: 'N',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'times',
        i18nKey: 'timesCount'
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store index in',
        i18nKey: 'store index in'
    }, {
        type: 'argument',
        key: 'variableName',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'blocks',
        key: 'body'
    }]
}, {
    name: 'For each element of array',
    displayName: 'For each',
    type: 'command',
    code: 'for each',
    icon: 'rotate-cw',
    jsTemplate: (args) => `for (${args.variableName} of ${args.array}) {\n    ${args.body}\n}`,
    lib: 'core.logic',
    i18nKey: 'for each',
    displayI18nKey: 'for each',
    pieces: [{
        type: 'argument',
        key: 'variableName',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'of array',
        i18nKey: 'of array'
    }, {
        type: 'argument',
        key: 'array',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'blocks',
        key: 'body'
    }]
}, {
    name: 'break loop',
    type: 'command',
    code: 'break loop',
    icon: 'log-out',
    jsTemplate: () => 'break;\n',
    lib: 'core.logic',
    i18nKey: 'break loop',
    pieces: []
}, {
    name: 'AND logic operator',
    type: 'computed',
    code: 'a AND b',
    icon: 'bool',
    lib: 'core.logic',
    i18nKey: 'AND logic operator',
    hideLabel: true,
    hideIcon: true,
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'label',
        name: 'and',
        i18nKey: 'AND'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'boolean',
        required: true
    }],
    jsTemplate: (args) => `(${args.a} && ${args.b})`
}, {
    name: 'AND AND logic operator',
    type: 'computed',
    code: 'a AND b AND c',
    icon: 'bool',
    lib: 'core.logic',
    i18nKey: 'AND AND logic operator',
    hideLabel: true,
    hideIcon: true,
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'label',
        name: 'and',
        i18nKey: 'AND'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'label',
        name: 'and',
        i18nKey: 'AND'
    }, {
        type: 'argument',
        key: 'c',
        typeHint: 'boolean',
        required: true
    }],
    jsTemplate: (args) => `(${args.a} && ${args.b} && ${args.c})`
}, {
    name: 'OR logic operator',
    type: 'computed',
    code: 'a OR b',
    icon: 'bool',
    lib: 'core.logic',
    i18nKey: 'OR logic operator',
    hideLabel: true,
    hideIcon: true,
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'label',
        name: 'or',
        i18nKey: 'OR'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'boolean',
        required: true
    }],
    jsTemplate: (args) => `(${args.a} || ${args.b})`
}, {
    name: 'OR OR logic operator',
    type: 'computed',
    code: 'a OR b OR c',
    icon: 'bool',
    lib: 'core.logic',
    i18nKey: 'OR OR logic operator',
    hideLabel: true,
    hideIcon: true,
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'label',
        name: 'or',
        i18nKey: 'OR'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'boolean',
        required: true
    }, {
        type: 'label',
        name: 'or',
        i18nKey: 'OR'
    }, {
        type: 'argument',
        key: 'c',
        typeHint: 'boolean',
        required: true
    }],
    jsTemplate: (args) => `(${args.a} || ${args.b} || ${args.c})`
}, {
    name: 'NOT logic operator',
    displayName: 'not',
    type: 'computed',
    code: 'NOT a',
    icon: 'bool',
    hideIcon: true,
    lib: 'core.logic',
    i18nKey: 'NOT logic operator',
    displayI18nKey: 'NOT logic operator',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'boolean',
        required: true
    }],
    jsTemplate: (args) => `!${args.a}`
}, {
    name: 'is',
    code: 'is',
    icon: 'help-circle',
    type: 'computed',
    typeHint: 'boolean',
    hideIcon: true,
    hideLabel: true,
    i18nKey: 'is',
    jsTemplate: (vals) => `(${vals.a} === ${vals.b})`,
    lib: 'core.logic',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'is',
        i18nKey: 'is'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'wildcard',
        required: true
    }],
    mutators: [{
        lib: 'core.logic',
        code: 'is not'
    }]
}, {
    name: 'is not',
    code: 'is not',
    icon: 'help-circle',
    type: 'computed',
    typeHint: 'boolean',
    hideIcon: true,
    hideLabel: true,
    i18nKey: 'is not',
    jsTemplate: (vals) => `(${vals.a} !== ${vals.b})`,
    lib: 'core.logic',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'is not',
        i18nKey: 'is not'
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'wildcard',
        required: true
    }],
    mutators: [{
        lib: 'core.logic',
        code: 'is'
    }]
}, {
    name: 'convert to boolean',
    i18nKey: 'convert to boolean',
    type: 'computed',
    code: 'convert to boolean',
    icon: 'bool',
    jsTemplate: (values) => `Boolean(${values.val})`,
    lib: 'core.logic',
    pieces: [{
        type: 'argument',
        key: 'val',
        typeHint: 'wildcard',
        required: true
    }],
    typeHint: 'boolean'
}, {
    name: 'true',
    i18nKey: 'true',
    type: 'computed',
    code: 'true',
    icon: 'bool',
    jsTemplate: () => 'true',
    lib: 'core.logic',
    pieces: [],
    typeHint: 'boolean',
    customClass: 'constant',
    onClickMutator: {
        lib: 'core.logic',
        code: 'false'
    },
    mutators: [{
        lib: 'core.logic',
        code: 'false'
    }]
}, {
    name: 'false',
    i18nKey: 'false',
    type: 'computed',
    code: 'false',
    icon: 'bool',
    jsTemplate: () => 'false',
    lib: 'core.logic',
    pieces: [],
    typeHint: 'boolean',
    customClass: 'constant',
    onClickMutator: {
        lib: 'core.logic',
        code: 'true'
    },
    mutators: [{
        lib: 'core.logic',
        code: 'true'
    }]
}];

makeMutators(blocks, ['a AND b', 'a AND b AND c', 'a OR b', 'a OR b OR c']);

export default blocks;

const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [{
    name: 'action value',
    type: 'computed',
    code: 'action value',
    icon: 'airplay',
    lib: 'core.actions',
    i18nKey: 'action value',
    typeHint: 'number',
    pieces: [{
        type: 'argument',
        assets: 'action',
        typeHint: 'string',
        key: 'action'
    }],
    jsTemplate: (values) => `actions[${values.action}].value`
}, {
    name: 'is action pressed',
    type: 'computed',
    code: 'action pressed',
    icon: 'airplay',
    lib: 'core.actions',
    i18nKey: 'is action pressed',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        assets: 'action',
        typeHint: 'string',
        key: 'action'
    }],
    jsTemplate: (values) => `actions[${values.action}].pressed`,
    mutators: [{
        code: 'action down',
        lib: 'core.actions'
    }, {
        code: 'action released',
        lib: 'core.actions'
    }]
}, {
    name: 'is action down',
    type: 'computed',
    code: 'action down',
    icon: 'airplay',
    lib: 'core.actions',
    i18nKey: 'is action down',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        assets: 'action',
        typeHint: 'string',
        key: 'action'
    }],
    jsTemplate: (values) => `actions[${values.action}].down`,
    mutators: [{
        code: 'action pressed',
        lib: 'core.actions'
    }, {
        code: 'action released',
        lib: 'core.actions'
    }]
}, {
    name: 'is action released',
    type: 'computed',
    code: 'action released',
    icon: 'airplay',
    lib: 'core.actions',
    i18nKey: 'is action released',
    typeHint: 'boolean',
    pieces: [{
        type: 'argument',
        assets: 'action',
        typeHint: 'string',
        key: 'action'
    }],
    jsTemplate: (values) => `actions[${values.action}].released`,
    mutators: [{
        code: 'action down',
        lib: 'core.actions'
    }, {
        code: 'action pressed',
        lib: 'core.actions'
    }]
}];

export default blocks;

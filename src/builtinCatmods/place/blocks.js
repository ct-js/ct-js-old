export default [{
    name: 'Move this copy along a line stopping at',
    name_Ru: 'Переместиться по линии, останавливаясь перед группой',
    type: 'command',
    code: 'move template bullet',
    icon: 'move',
    category: 'Movement',
    pieces: [{
        type: 'argument',
        key: 'cgroup',
        typeHint: 'string',
        required: true
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store in',
        i18nKey: 'store in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard'
    }],
    jsTemplate: (values) => {
        if (values.return !== 'undefined') {
            return `${values.return} = this.moveBullet(${values.cgroup}, ${values.precision || 1});`;
        }
        return `this.moveBullet(${values.cgroup}, ${values.precision || 1});`;
    }
}, {
    name: 'Move this copy stopping at',
    name_Ru: 'Переместиться, останавливаясь перед группой',
    type: 'command',
    code: 'move template smart',
    icon: 'move',
    category: 'Movement',
    pieces: [{
        type: 'argument',
        key: 'cgroup',
        typeHint: 'string',
        required: true
    }, {
        type: 'filler'
    }, {
        type: 'label',
        name: 'store in',
        i18nKey: 'store in'
    }, {
        type: 'argument',
        key: 'return',
        typeHint: 'wildcard'
    }],
    jsTemplate: (values) => {
        if (values.return !== 'undefined') {
            return `${values.return} = this.moveSmart(${values.cgroup}, ${values.precision || 1});`;
        }
        return `this.moveSmart(${values.cgroup}, ${values.precision || 1});`;
    }
}];

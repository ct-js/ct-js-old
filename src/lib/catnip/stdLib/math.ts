const niceOperators: Record<string, string> = {
    '*': '×',
    '/': ':',
    '<=': '≤',
    '>=': '≥'
};

const numberOperators = ['+', '-', '*', '/', '%'],
      boolOperators = ['<', '<=', '>', '>='],
      mathUnaryOperators = ['abs', 'sign', 'floor', 'ceil', 'round', 'sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan'],
      mathBinaryOperators = ['atan2', 'pow', 'log', 'min', 'max'];

const makeOperator = (operator: string, type: blockArgumentType): IBlockComputedDeclaration => ({
    name: operator,
    code: operator,
    displayName: niceOperators[operator] || operator,
    icon: type === 'boolean' ? 'help-circle' : 'hash',
    type: 'computed',
    typeHint: type,
    hideIcon: true,
    hideLabel: true,
    jsTemplate: (vals) => `(${vals.a} ${operator} ${vals.b})`,
    lib: 'core.math',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: niceOperators[operator] || operator
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'number',
        required: true
    }],
    mutators: (type === 'boolean' ? boolOperators : numberOperators).filter(op => op !== operator).map((op) => ({
        lib: 'core.math',
        code: op
    }))
});
const makeMathUnary = (operator: string): IBlockComputedDeclaration => ({
    name: operator,
    displayName: niceOperators[operator] || operator,
    code: operator,
    icon: 'sort-numerically',
    type: 'computed',
    typeHint: 'number',
    hideIcon: true,
    i18nKey: 'math ' + operator,
    jsTemplate: (vals) => `Math.${operator}(${vals.a})`,
    lib: 'core.math',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'number',
        required: true
    }]
});
const makeMathBinary = (operator: string): IBlockComputedDeclaration => ({
    name: operator,
    displayName: niceOperators[operator] || operator,
    code: operator,
    icon: 'sort-numerically',
    type: 'computed',
    typeHint: 'number',
    hideIcon: true,
    i18nKey: 'math ' + operator,
    jsTemplate: (vals) => `Math.${operator}(${vals.a}, ${vals.b})`,
    lib: 'core.math',
    pieces: [{
        type: 'argument',
        key: 'a',
        typeHint: 'number',
        required: true
    }, {
        type: 'argument',
        key: 'b',
        typeHint: 'number',
        required: true
    }]
});

const blocks: (IBlockComputedDeclaration | IBlockCommandDeclaration)[] = [
    ...numberOperators.map((operator) => makeOperator(operator, 'number')),
    ...boolOperators.map((operator) => makeOperator(operator, 'boolean')),
    ...mathUnaryOperators.map((operator) => makeMathUnary(operator)),
    ...mathBinaryOperators.map((operator) => makeMathBinary(operator)),
    {
        name: 'convert to number',
        i18nKey: 'convert to number',
        type: 'computed',
        code: 'convert to number',
        icon: 'sort-numerically',
        jsTemplate: (values) => `Number(${values.val})`,
        lib: 'core.utils',
        pieces: [{
            type: 'argument',
            key: 'val',
            typeHint: 'wildcard',
            required: true
        }],
        typeHint: 'number'
    }
];

export default blocks;

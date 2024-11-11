import * as monaco from 'monaco-editor';
import {getOfType} from 'src/lib/resources';

const getInsertRange = function getInsertRange(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    var word = model.getWordUntilPosition(position);
    return {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
    };
};

const createTemplateProposals = function createTemplateProposals(range: monaco.IRange) {
    // filtering is done by the Monaco editor
    return getOfType('template').map(template => ({
        label: template.name,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: `'${template.name}'`,
        range
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const createRoomProposals = function createRoomProposals(range: monaco.IRange) {
    return getOfType('room').map(room => ({
        label: room.name,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: `'${room.name}'`,
        range
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const createSoundProposals = function createSoundProposals(range: monaco.IRange) {
    return getOfType('sound').map(sound => ({
        label: sound.name,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: `'${sound.name}'`,
        range
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const createActionProposals = function createActionProposals(range: monaco.IRange) {
    return (window.currentProject as IProject).actions.map(action => ({
        label: action.name,
        kind: monaco.languages.CompletionItemKind.Property,
        insertText: action.name,
        range
    })).sort((a, b) => a.label.localeCompare(b.label));
};

const createPSProposals = function createPSProposals(range: monaco.IRange) {
    return getOfType('tandem').map(et => ({
        label: et.name,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: `'${et.name}'`,
        range
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const createScriptProposals = function createScriptProposals(range: monaco.IRange) {
    return getOfType('script').map(et => ({
        label: et.name,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: `${et.name}()`,
        range
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const checkMatch = function checkMatch(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    regex: string | RegExp
) {
    var textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
    });
    return textUntilPosition.match(regex);
};

const provideTemplateNames = function provideTemplateNames(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /templates\.((make|copy|exists)\(|list\[|templates\[)$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createTemplateProposals(range)
    };
};
const provideTemplateNamesCS = function provideTemplateNamesCS(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /templates\.((make|copy|exists)( |\()|list\[|templates\[)$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createTemplateProposals(range)
    };
};

const provideRoomNames = function provideRoomNames(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /rooms\.((switch|append|prepend|merge)\(|templates\[|list\[)$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createRoomProposals(range)
    };
};
const provideRoomNamesCS = function provideRoomNamesCS(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /rooms\.((switch|append|prepend|merge)( |\()|templates\[|list\[)$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createRoomProposals(range)
    };
};

const provideSoundNames = function provideSoundNames(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /sounds\.(play|playAt|volume|fade|stop|pause|resume|position|load|playing)\($/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createSoundProposals(range)
    };
};
const provideSoundNamesCS = function provideSoundNamesCS(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /sounds\.(play|volume|fade|stop|pause|resume|position|load|playing)( |\()$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createSoundProposals(range)
    };
};

// Suits both civet and typescript
const provideActionNames = function provideActionNames(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /actions\.$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createActionProposals(range)
    };
};

const providePSNames = function providePSNames(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /emitters\.(fire|append|follow)\($/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createPSProposals(range)
    };
};
const providePSNamesCS = function providePSNamesCS(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /emitters\.(fire|append|follow)(\(| )$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createPSProposals(range)
    };
};

// Suits both civet and typescript
const provideScriptNames = function provideScriptNames(
    model: monaco.editor.ITextModel,
    position: monaco.Position
) {
    if (!checkMatch(model, position, /scripts\.$/)) {
        return {
            suggestions: []
        };
    }
    const range = getInsertRange(model, position);
    return {
        suggestions: createScriptProposals(range)
    };
};
export default () => {
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: provideTemplateNames,
        triggerCharacters: ['(', '[']
    });
    monaco.languages.registerCompletionItemProvider('civet', {
        provideCompletionItems: provideTemplateNamesCS,
        triggerCharacters: [' ', '(', '[']
    });
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: provideSoundNames,
        triggerCharacters: ['(']
    });
    monaco.languages.registerCompletionItemProvider('civet', {
        provideCompletionItems: provideSoundNamesCS,
        triggerCharacters: ['(', ' ']
    });
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: provideActionNames,
        triggerCharacters: ['.']
    });
    monaco.languages.registerCompletionItemProvider('civet', {
        provideCompletionItems: provideActionNames,
        triggerCharacters: ['.']
    });
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: provideRoomNames,
        triggerCharacters: ['(', '[']
    });
    monaco.languages.registerCompletionItemProvider('civet', {
        provideCompletionItems: provideRoomNamesCS,
        triggerCharacters: ['(', '[', ' ']
    });
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: providePSNames,
        triggerCharacters: ['(']
    });
    monaco.languages.registerCompletionItemProvider('civet', {
        provideCompletionItems: providePSNamesCS,
        triggerCharacters: ['(', ' ']
    });
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: provideScriptNames,
        triggerCharacters: ['.']
    });
    monaco.languages.registerCompletionItemProvider('civet', {
        provideCompletionItems: provideScriptNames,
        triggerCharacters: ['.']
    });
};

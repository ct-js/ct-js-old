import * as monaco from 'monaco-editor';
window.monaco = monaco;

import completions from './completions';
import helpers from './helpers';

const coffeescriptTokenizer = require('src/lib/coffeescriptTokenizer.js').language;
import {completionsProvider as civetCompletions} from 'src/lib/civetLanguageFeatures';

export default () => {
    // @see https://github.com/microsoft/monaco-editor-samples/blob/master/nwjs-amd-v2/index.html
    self.MonacoEnvironment = {
        getWorkerUrl(moduleId, label) {
            if (label === 'json') {
                return './data/monaco-workers/vs/language/json/json.worker.js';
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                return './data/monaco-workers/vs/language/css/css.worker.js';
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return './data/monaco-workers/vs/language/html/html.worker.js';
            }
            if (label === 'typescript' || label === 'javascript') {
                return './data/monaco-workers/vs/language/typescript/ts.worker.js';
            }
            return './data/monaco-workers/vs/editor/editor.worker.js';
        }
    };

    const monacoConfig = {
        hovers: false,
        codeActions: true,
        completionItems: true,
        definitions: true,
        diagnostics: true,
        documentHighlights: true,
        // eslint-disable-next-line id-length
        documentRangeFormattingEdits: true,
        documentSymbols: true,
        inlayHints: true,
        onTypeFormattingEdits: true,
        references: true,
        rename: true,
        signatureHelp: true
    };
    // Need to set defaults before any editor is created
    monaco.languages.typescript.typescriptDefaults.setModeConfiguration(monacoConfig);
    monaco.languages.typescript.javascriptDefaults.setModeConfiguration(monacoConfig);

    // Extended typescript tokenizer
    const typescriptTokenizer = require('src/lib/typescriptTokenizer.js').language;
    // Extended coffeescript tokenizer & suggestions provider
    const {HoverProvider: TsHoverProvider} = require('src/lib/catniplessTsHoverProvider.js');

    const themeManager = require('src/lib/themes');

    themeManager.loadBuiltInThemes();
    // To rollback to a default theme if the set one is inaccessible ⤵
    themeManager.loadTheme();

    // I have no guilt of this solution
    // @see https://github.com/microsoft/monaco-editor/issues/884
    monaco.editor.create(document.createElement('textarea'), {
        language: 'typescript',
        value: '(:'
    });
    monaco.editor.create(document.createElement('textarea'), {
        language: 'civet',
        value: ':)'
    });
    setTimeout(() => {
        monaco.languages.setMonarchTokensProvider('typescript', typescriptTokenizer);
        monaco.languages.setMonarchTokensProvider('civet', coffeescriptTokenizer);
        monaco.languages.typescript.getTypeScriptWorker()
        .then((client) => {
            monaco.languages.registerCompletionItemProvider('civet', civetCompletions);

            const hoverProvider = new TsHoverProvider(client);
            monaco.languages.registerHoverProvider('typescript', hoverProvider);
            monaco.languages.registerHoverProvider('javascript', hoverProvider);

            window.signals.trigger('monacoBooted');
        });
        helpers();
        completions();
    }, 1000);
};

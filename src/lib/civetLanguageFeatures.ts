/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import * as monaco from 'monaco-editor';
// eslint-disable-next-line no-duplicate-imports
import type Monaco from 'monaco-editor';
const {languages} = monaco;
import type ts from 'typescript';

import {compile, SourceMap} from '@danielx/civet';
// eslint-disable-next-line id-length
const {flattenDiagnosticMessageText} = require('@danielx/civet/ts-diagnostic');
import {civetOptions} from './exporter/scriptableProcessor';
export type SourcemapLines = SourceMap['data']['lines'];

type Span = {
    start: number;
    length: number;
};

// The principle here is that we create an offscreen TypeScript document,
// put Civet statements into it with `@` replacement, and steal
// its code suggestions and diagnostics into another code editor.
const completionsModel = monaco.editor.createModel('', 'typescript', monaco.Uri.file('civetCompletions.ts'));
// Need two separate models as operations are async and they would taint model content
// while requesting data.
const diagnosticsModel = monaco.editor.createModel('', 'typescript', monaco.Uri.file('civetDiagnostics.ts'));

// There's definitely something not used in this list, but whatever
const workerToTSTypeMap = {
    function: monaco.languages.CompletionItemKind.Function,
    method: monaco.languages.CompletionItemKind.Function,
    property: monaco.languages.CompletionItemKind.Property,
    constant: monaco.languages.CompletionItemKind.Constant,
    namespace: monaco.languages.CompletionItemKind.Module,
    module: monaco.languages.CompletionItemKind.Module,
    class: monaco.languages.CompletionItemKind.Class,
    var: monaco.languages.CompletionItemKind.Variable,
    variable: monaco.languages.CompletionItemKind.Variable,
    default: monaco.languages.CompletionItemKind.Text
};

export const completionsProvider: Monaco.languages.CompletionItemProvider = {
    triggerCharacters: ['@', '.'],
    provideCompletionItems: async (model: Monaco.editor.ITextModel, position: Monaco.Position):
    Promise<Monaco.languages.CompletionList> => {
        const worker = await languages.typescript.getTypeScriptWorker();
        const workhorse = await worker(completionsModel.uri);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 0,
            endColumn: position.column
        };
        let currentLine = model.getValueInRange(range);
        // decaffeinate properties of `this`
        if (currentLine.endsWith('@')) {
            currentLine = currentLine.slice(0, -1) + 'this.';
        }
        currentLine = currentLine.split(' ').pop()!;
        // Add type definitions set by a code-editor-scriptable tag.
        currentLine = ((model as (Monaco.editor.ITextModel & {
            ctCodePrefix: string
        })).ctCodePrefix || 'function () {') + currentLine;
        currentLine += '\n}';
        const suggestPos = currentLine.length - 1;
        completionsModel.setValue(currentLine);
        const completions: ts.CompletionInfo | undefined =
            await workhorse.getCompletionsAtPosition(
                completionsModel.uri.toString(),
                suggestPos
            );
        if (!completions) {
            return {
                suggestions: []
            };
        }
        return {
            suggestions: completions.entries
                // filter out any private-ish properties, mainly from pixi.js
                .filter(completion => !completion.name.startsWith('_'))
                .map(completion => ({
                    label: completion.name,
                    kind:
                        workerToTSTypeMap[completion.kind as keyof typeof workerToTSTypeMap] ||
                        workerToTSTypeMap.default,
                    insertText: completion.insertText || completion.name
                })) as Monaco.languages.CompletionItem[]
        };
    }
};

const diagnosticToMarkerMap: Record<
    Monaco.languages.typescript.DiagnosticRelatedInformation['category'],
    Monaco.MarkerSeverity
> = {
    0: 4,
    1: 8,
    2: 1,
    3: 2
};

const remapPosition = (
    position: Monaco.IPosition,
    sourcemapLines: SourcemapLines
): Monaco.IPosition => {
    if (!sourcemapLines) {
        return position;
    }
    const {lineNumber: line, column: character} = position;
    const textLine = sourcemapLines[line];
    if (!textLine?.length) {
        return position;
    }
    let i = 0,
        p = 0,
        lastMapping,
        lastMappingPosition = 0;
    const l = textLine.length;
    while (i < l) {
        const mapping = textLine[i];
        p += mapping[0];
        if (mapping.length === 4) {
            lastMapping = mapping;
            lastMappingPosition = p;
        }
        if (p >= character) {
            break;
        }
        i++;
    }
    if (lastMapping) {
        const srcLine = lastMapping[2];
        const srcChar = lastMapping[3];
        const newChar = srcChar + character - lastMappingPosition;
        return {
            lineNumber: srcLine,
            column: newChar
        };
    }
    return position;
};

const remapRange = (range: Monaco.IRange, sourcemapLines: SourcemapLines): Monaco.IRange => {
    const start = remapPosition({
        lineNumber: range.startLineNumber,
        column: range.startColumn
    }, sourcemapLines);
    const end = remapPosition({
        lineNumber: range.endLineNumber,
        column: range.endColumn
    }, sourcemapLines);
    return {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
    };
};

const rangeFromTextSpan = (span: Span, model: Monaco.editor.ITextModel): Monaco.IRange => {
    const start = model.getPositionAt(span.start),
          end = model.getPositionAt(span.start + span.length);
    return {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
    };
};

const convertDiagnostic = function (
    diagnostic: Monaco.languages.typescript.Diagnostic,
    model: Monaco.editor.ITextModel,
    sourcemapLines: SourcemapLines
): Monaco.editor.IMarkerData {
    const range = rangeFromTextSpan({
        start: diagnostic.start || 0,
        length: diagnostic.length ?? 1
    }, model);
    const remappedRange = remapRange(range, sourcemapLines);
    return {
        message: flattenDiagnosticMessageText(diagnostic.messageText),
        startLineNumber: remappedRange.startLineNumber,
        startColumn: remappedRange.startColumn,
        endLineNumber: remappedRange.endLineNumber,
        endColumn: remappedRange.endColumn,
        severity: diagnosticToMarkerMap[diagnostic.category],
        source: (diagnostic.source || 'typescript') + `(${diagnostic.code})`
    };
};

const wrapValueIntoWrappers = (val: string, start: string, end: string): string =>
    start + '\n' +
    val
        .split('\n')
        .map(l => `    ${l}`)
        .join('\n') +
    '\n' + end;

export const provideMarkers = (editor: Monaco.editor.IStandaloneCodeEditor & {
    wrapperStart?: string,
    wrapperEnd?: string
}): void => {
    editor.onDidChangeModelContent(async () => {
        let val = editor.getValue();
        let lineOffset = 0,
            columnOffset = 0;
        if (editor.wrapperStart) {
            // pad all lines and wrap them in a function
            val = wrapValueIntoWrappers(val, editor.wrapperStart!, editor.wrapperEnd!);
            lineOffset = editor.wrapperStart.split('\n').length;
            columnOffset = 4;
        }
        let sourceMap: SourceMap,
            code: string;
        try {
            ({sourceMap, code} = await compile(val, {
                ...civetOptions,
                filename: 'civetCompletions.ts',
                sync: false,
                sourceMap: true
            }));
        } catch (e) {
            if (e?.name !== 'ParseError') {
                throw e;
            }
            const {column, line} = e;
            monaco.editor.setModelMarkers(editor.getModel()!, 'owner', [{
                startColumn: column - columnOffset,
                startLineNumber: line - lineOffset,
                endColumn: column - columnOffset + 1,
                endLineNumber: line - lineOffset,
                severity: 8,
                message: e.message.slice('unknown:'.length)
            }]);
            return;
        }
        diagnosticsModel.setValue(code);
        const worker = await languages.typescript.getTypeScriptWorker();
        const workhorse = await worker(diagnosticsModel.uri);
        const issues = (await Promise.all([
            workhorse.getSemanticDiagnostics(diagnosticsModel.uri.toString()),
            workhorse.getSyntacticDiagnostics(diagnosticsModel.uri.toString()),
            workhorse.getSuggestionDiagnostics(diagnosticsModel.uri.toString())
            // workhorse.getCompilerOptionsDiagnostics(diagnosticsModel.uri.toString())
        ])).reduce((a, b) => a.concat(b), []);
        const markers: Monaco.editor.IMarkerData[] = issues
            .map(issue => convertDiagnostic(issue, diagnosticsModel, sourceMap.data.lines))
            // Skip complaints about unused ct.js base classes
            .filter(diag => diag.startLineNumber !== 1);
        for (const marker of markers) {
            marker.endLineNumber -= lineOffset;
            marker.endColumn -= columnOffset;
            marker.startLineNumber -= lineOffset;
            marker.startColumn -= columnOffset;
        }
        monaco.editor.setModelMarkers(editor.getModel()!, 'owner', markers);
    });
};


/**
 * The normal direction for sourcemapping is reverse, given a position in the GENERATED file
 * it points to a position in the SOURCE file.
 *
 * To do the opposite and find the position in the GENERATED file FROM THE SOURCE file
 * ("forward map") we want to find the "best" mapping.
 * The best mapping is the closest mapping with line <= original line
 * (ideally it will be equal to the original line), and column <= (original column).
 *
 * To find that mapping we check every reverse mapping holding on to the best one so far.
 * If we're in the middle of an identifier and the best one begins a few characters
 * before the original column that is probably fine since we don't map
 * into the middle of identifiers.
 *
 * We linearly advance the found line and offset by the difference.
 *
 * @source https://github.com/DanielXMoore/Civet/blob/dc9d83f29c4b6dd5f87e07e9aecbae4b12ceb72c/lsp/source/lib/util.mts
 */
const forwardMap = (sourcemapLines: SourcemapLines, position: {
    line: number,
    character: number
}): {
    line: number,
    character: number
} => {
    const {line: origLine, character: origOffset} = position;
    const sourceLine = origLine - 1; // Monaco line numbers are 1-based, so subtract 1

    let col = 0;
    let bestLine = -1,
        bestOffset = -1,
        foundLine = -1,
        foundOffset = -1;

    sourcemapLines.forEach((line, i) => {
        col = 0;
        line.forEach((mapping) => {
            col += mapping[0];

            if (mapping.length === 4) {
          // find best line without going beyond
                const [, , srcLine, srcOffset] = mapping;
                if (srcLine <= sourceLine) {
                    // eslint-disable-next-line max-len, no-mixed-operators
                    if (srcLine > bestLine && (srcOffset <= origOffset) || srcLine === bestLine && (srcOffset <= origOffset) && (srcOffset >= bestOffset)) {
                        bestLine = srcLine;
                        bestOffset = srcOffset;
                        foundLine = i;
                        foundOffset = col;
                    }
                }
            }
        });
    });

    if (foundLine >= 0) {
        const genLine = foundLine + sourceLine - bestLine;
        const genOffset = foundOffset + origOffset - bestOffset;

      // console.log(`transformed position ${[origLine, origOffset]} => ${[genLine, genOffset]}`)

        return {
            line: genLine + 1, // Don't forget to add 1 to line number for Monaco
            character: genOffset
        };
    }

    // console.warn(`couldn't forward map src position: ${[origLine, origOffset]}`)
    return position;
};


/** Custom hover provider that removes @catnip tags from documentation  */
export const displayPartsToString = function (displayParts: {
    text: string
}[]) {
    if (displayParts) {
        return displayParts.map((displayPart) => displayPart.text).join('');
    }
    return '';
};

export const tagToString = function (docTag: ts.JSDocTagInfo) {
    let tagLabel = `*@${docTag.name}*`;
    if (docTag.name === 'param' && docTag.text) {
        const [paramName, ...rest] = docTag.text;
        tagLabel += `\`${paramName.text}\``;
        if (rest.length > 0) {
            tagLabel += ` — ${rest.map((r) => r.text).join(' ')}`;
        }
    } else if (Array.isArray(docTag.text)) {
        tagLabel += ` — ${docTag.text.map((r) => r.text).join(' ')}`;
    } else if (docTag.text) {
        tagLabel += ` — ${docTag.text}`;
    }
    return tagLabel;
};

export class CivetHoverProvider {
    private _worker: (uri: Monaco.Uri) => Promise<Monaco.languages.typescript.TypeScriptWorker>;
    constructor(worker: (uri: Monaco.Uri) =>
        Promise<Monaco.languages.typescript.TypeScriptWorker>) {
        this._worker = worker;
    }
    // eslint-disable-next-line class-methods-use-this
    _textSpanToRange(model: Monaco.editor.ITextModel, span: Span) {
        const p1 = model.getPositionAt(span.start);
        const p2 = model.getPositionAt(span.start + span.length);
        const {lineNumber: startLineNumber, column: startColumn} = p1;
        const {lineNumber: endLineNumber, column: endColumn} = p2;
        return {
            startLineNumber, startColumn, endLineNumber, endColumn
        };
    }
    async provideHover(model: Monaco.editor.ITextModel & {
        wrapperStart?: string,
        wrapperEnd?: string
    }, position: Monaco.Position): Promise<Monaco.languages.Hover | undefined> {
        let val = model.getValue();
        let lineOffset = 0,
            columnOffset = 0;
        if (model.wrapperStart) {
            // pad all lines and wrap them in a function
            val = wrapValueIntoWrappers(val, model.wrapperStart!, model.wrapperEnd!);
            lineOffset = model.wrapperStart.split('\n').length;
            columnOffset = 4;
        }
        let sourceMap, code;
        try {
            ({sourceMap, code} = await compile(val, {
                ...civetOptions,
                filename: 'civetCompletions.ts',
                sync: false,
                sourceMap: true
            }));
        } catch (e) {
            void e;
            return;
        }
        const worker = await this._worker(completionsModel.uri);
        const compiledPosition = forwardMap(sourceMap.data.lines, {
            line: position.lineNumber + lineOffset,
            character: position.column + columnOffset
        });
        completionsModel.setValue(code);
        const offset = completionsModel.getOffsetAt({
            column: compiledPosition.character,
            lineNumber: compiledPosition.line
        });
        const info: ts.QuickInfo | undefined =
            await worker.getQuickInfoAtPosition(completionsModel.uri.toString(), offset);
        if (!info || model.isDisposed()) {
            return;
        }
        const documentation = info.documentation ? displayPartsToString(info.documentation) : '';
        const tags = info.tags ?
            info.tags
                .filter(docTag => !docTag.name.startsWith('@catnip`'))
                .map((docTag) => tagToString(docTag))
                .join('  \n\n') :
            '';
        const contents = displayPartsToString(info.displayParts!);
        // eslint-disable-next-line consistent-return
        return {
            contents: [
                {
                    value: '```typescript\n' + contents + '\n```\n'
                },
                {
                    value: documentation + (tags ? '\n\n' + tags : '')
                }
            ]
        };
    }
}

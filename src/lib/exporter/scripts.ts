import {ExporterError, highlightProblem} from './ExporterError';
import {coffeeScriptOptions} from './scriptableProcessor';
import {compile as compileCatnip} from '../catnip/compiler';

const compileCoffee = require('coffeescript').CoffeeScript.compile;
const typeScript = require('sucrase').transform;

export const stringifyScripts = (scripts: IScript[]): string =>
    scripts.reduce((acc, script) => {
        let code;
        try { // Apply converters to the user's code first
            switch (script.language) {
            case 'typescript':
                ({code} = typeScript(script.code, {
                    transforms: ['typescript']
                }));
                break;
            case 'coffeescript':
                code = compileCoffee(script.code, coffeeScriptOptions);
                break;
            case 'catnip':
                code = compileCatnip(script.code as BlockScript, {
                    resourceId: script.uid,
                    resourceName: script.name,
                    resourceType: script.type,
                    eventKey: 'onRun'
                });
                break;
            default: throw new Error(`Unsupported script language: ${script.language}`);
            }
            return acc + `'${script.name}': function (options) {${code}},`;
        } catch (e) {
            const errorMessage = `${e.name || 'An error'} occured while compiling script ${script.name}`;
            if (e instanceof ExporterError) {
                // Passthrough already formatted errors, mainly coming from Catnip
                throw e;
            } else {
                const exporterError = new ExporterError(errorMessage, {
                    resourceId: script.uid,
                    resourceName: script.name,
                    resourceType: script.type,
                    problematicCode: highlightProblem(e.code || code, e.location || e.loc),
                    clue: 'syntax'
                }, e);
                throw exporterError;
            }
        }
    }, '');

export const getStartupScripts = (scripts: IScript[]): string => {
    const startup = scripts.filter(s => s.runAutomatically);
    return startup.reduce(
        (acc, script) => acc + `scripts['${script.name}']({});\n`,
        ''
    );
};

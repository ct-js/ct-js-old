import {getLanguageJSON, localizeField} from '../i18n';
import {assetTypes, getById, getThumbnail} from '../resources';
import {fieldTypeToTsType} from '../resources/content';
import {getTypescriptEnumName} from '../resources/enums';

const categories: Record<string, IEventCategory> = {
    lifecycle: {
        name: 'Lifecycle',
        icon: 'rotate-cw'
    },
    actions: {
        name: 'Actions',
        icon: 'airplay'
    },
    pointer: {
        name: 'PointerEvents',
        icon: 'ui'
    },
    animation: {
        name: 'AnimatedSpriteEvents',
        icon: 'template'
    },
    input: {
        name: 'InputEvents',
        icon: 'textbox'
    },
    timers: {
        name: 'Timers',
        icon: 'clock'
    },
    app: {
        name: 'Application',
        icon: 'room'
    },
    misc: {
        name: 'Miscellaneous',
        icon: 'grid'
    }
};

import coreEventsLifecycle from './coreEventsLifecycle';
import coreEventsActions from './coreEventsActions';
import coreEventsAnimation from './coreEventsAnimation';
import coreEventsPointer from './coreEventsPointer';
import coreEventsTimers from './coreEventsTimers';
import coreEventsApp from './coreEventsApp';
import coreEventsInput from './coreEventsInput';

const events: Record<string, IEventDeclaration> = {
    // Basic, primitive events, aka lifecycle events
    ...coreEventsLifecycle,
    ...coreEventsActions,
    ...coreEventsPointer,
    ...coreEventsAnimation,
    ...coreEventsInput,
    ...coreEventsTimers,
    ...coreEventsApp
};

const eventNameRegex = /^(\S+?)_(\S+)$/;
/**
 * Returns the library and the event code from the full event key
 */
const splitEventName = (name: string): [string, string] => {
    const result = eventNameRegex.exec(name)!;
    return [result[1], result[2]];
};

type EventMenuEventData = {
    eventKey: string,
    event: IEventDeclaration
}
interface IEventMenuEvent extends IMenuItem {
    affixedData: EventMenuEventData
}

interface IEventMenuSubmenu extends IMenuItem {
    affixedData: {
        key: string;
        category: IEventCategory;
        core: boolean;
    }
    submenu: {
        items: IEventMenuEvent[];
    }
}
type EventMenu = {
    items: IEventMenuSubmenu[];
};


export const getFullKey = (scriptableEvt: IScriptableEvent) => `${scriptableEvt.lib}_${scriptableEvt.eventKey}`;

const getEventByLib = (event: string, libName: string): IEventDeclaration | undefined =>
    events[`${libName}_${event}`];

const localizeCategoryName = (categoryKey: string): string => {
    const i18nScriptables = getLanguageJSON().scriptables;
    const category = categories[categoryKey];
    if (i18nScriptables.coreEventsCategories[categoryKey]) {
        return i18nScriptables.coreEventsCategories[categoryKey];
    }
    return localizeField(category, 'name');
};

export const getIsParametrized = (scriptableEvt: IScriptableEvent) => {
    const event = getEventByLib(scriptableEvt.eventKey, scriptableEvt.lib);
    if (!event) {
        throw new Error(`Event "${getFullKey(scriptableEvt)}" was not found.`);
    }
    return event.arguments && Object.keys(event.arguments).length;
};
export const getHasLocalVars = (scriptableEvt: IScriptableEvent) => {
    const event = getEventByLib(scriptableEvt.eventKey, scriptableEvt.lib);
    if (!event) {
        throw new Error(`Event "${getFullKey(scriptableEvt)}" was not found.`);
    }
    return event.locals && Object.keys(event.locals).length;
};

const timerPattern = /^Timer(\d)$/;
const propToCoreDictionary = {
    category: 'coreEventsCategories',
    name: 'coreEvents',
    hint: 'coreEventsDescriptions'
} as Record<string, string>;
const localizeProp = (eventFullCode: string, prop: string): string => {
    const [lib, eventCode] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    if (lib === 'core') {
        if (timerPattern.test(eventCode)) {
            return getLanguageJSON().scriptables[propToCoreDictionary[prop]].Timer.replace('$1', timerPattern.exec(eventCode)![1]);
        }
        return getLanguageJSON().scriptables[propToCoreDictionary[prop]][eventCode];
    }
    return localizeField(event, prop);
};

const localizeParametrized = (eventFullCode: string, scriptedEvent: IScriptableEvent): string => {
    const [lib, eventCode] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    let {name} = event;
    if (lib === 'core') {
        name = getLanguageJSON().scriptables.coreParameterizedNames[eventCode];
    } else {
        name = localizeField(event, 'parameterizedName');
    }
    for (const argName in event.arguments) {
        let value = scriptedEvent.arguments[argName];
        if (assetTypes.indexOf(event.arguments[argName].type as resourceType) !== -1) {
            if (typeof value === 'string') {
                value = getById(null, value).name;
            } else {
                value = '(Unset)';
            }
        }
        const regex = new RegExp(`%%${argName}%%`);
        name = name.replace(regex, String(value));
    }
    return name;
};
const localizeArgument = (eventFullCode: string, arg: string): string => {
    const [lib] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    if (lib === 'core') {
        return getLanguageJSON().scriptables.coreEventsArguments[arg];
    }
    return localizeField(event.arguments![arg], 'name');
};
const localizeLocalVarDesc = (eventFullCode: string, local: string): string => {
    const [lib, eventCode] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    if (lib === 'core') {
        return getLanguageJSON().scriptables.coreEventsLocals[`${eventCode}_${local}`];
    }
    return localizeField(event.locals![local], 'description');
};
export const localizeEventName = (scriptableEvt: IScriptableEvent) => {
    if (getIsParametrized(scriptableEvt)) {
        return localizeParametrized(getFullKey(scriptableEvt), scriptableEvt);
    }
    return localizeProp(getFullKey(scriptableEvt), 'name');
};

const tryGetIcon = (eventFullCode: string, scriptedEvent: IScriptableEvent): string | false => {
    const event = events[eventFullCode];
    if (!event.useAssetThumbnail) {
        return false;
    }
    for (const argName in event.arguments) {
        if (['template', 'room', 'texture'].indexOf(event.arguments[argName].type) !== -1) {
            const value = scriptedEvent.arguments[argName];
            if (value === -1 || !value) {
                return 'data/img/unknown.png';
            }
            return getThumbnail(getById(null, value as string), false, false);
        }
    }
    return false;
};

const canUseBaseClass = (event: IEventDeclaration, baseClass: TemplateBaseClass): boolean => {
    if (!event.baseClasses || event.baseClasses.length === 0) {
        return true;
    }
    return event.baseClasses.includes(baseClass);
};

const bakeCategories = function bakeCategories(
    entity: EventApplicableEntities,
    callback: (affixedData: IEventDeclaration) => void,
    baseClass?: TemplateBaseClass,
    isBehavior?: boolean
): EventMenu {
    const menu = {
        items: [] as IEventMenuSubmenu[]
    };
    // Add categories
    for (const categoryKey in categories) {
        menu.items.push({
            label: localizeCategoryName(categoryKey),
            affixedData: {
                key: categoryKey,
                category: categories[categoryKey],
                core: true
            },
            icon: categories[categoryKey].icon,
            submenu: {
                items: [] as IEventMenuEvent[]
            }
        });
    }
    const miscCategory = menu.items.find(s => s.affixedData.core && s.affixedData.key === 'misc')!;
    for (const eventKey in events) {
        const event = events[eventKey];
        // Filter out events for other entities
        if (!event.applicable.includes(entity) && !(isBehavior && event.applicable.includes('behavior'))) {
            continue;
        }
        // Filter out events that require a specific base class
        // ⚠️ Does not filter out events for behaviors
        if (baseClass && !canUseBaseClass(event, baseClass)) {
            continue;
        }
        // Find if there is already a category for this event.
        let category = menu.items.find(section => section.affixedData.key === event.category);
        if (!category) {
            // Fallback to the "misc" category
            category = miscCategory;
        }
        // Add an event to a category
        category.submenu.items.push({
            label: localizeProp(eventKey, 'name') || event.name,
            hint: localizeProp(eventKey, 'hint') || event.hint,
            affixedData: {
                eventKey,
                event
            },
            icon: event.icon,
            click: callback
        });
    }
    // Reorder categories so that Misc is in the end of the list
    menu.items.splice(menu.items.indexOf(miscCategory), 1);
    menu.items.push(miscCategory);
    // Remove empty categories
    menu.items = menu.items.filter(cat => cat.submenu.items.length);
    return menu;
};

const getArgumentsTypeScript = (event: IEventDeclaration): string => {
    let code = '';
    if (event.locals) {
        for (const key in event.locals) {
            const local = event.locals[key];
            code += `var ${key}: ${local.type};`;
        }
    }
    return code;
};
export const getLocals = (event: string, libName: string): string[] => {
    const declaration = getEventByLib(event, libName)!;
    if (!declaration.locals) {
        return [];
    }
    return Object.keys(declaration.locals);
};
export const getFieldsTypeScript = (asset: IScriptable | IScriptableBehaviors): string => {
    let code = '';
    if ('behaviors' in asset) {
        for (const behaviorId of asset.behaviors) {
            const behavior = getById('behavior', behaviorId);
            if (behavior.specification.length) {
                code += '&{';
                for (const field of behavior.specification) {
                    // eslint-disable-next-line max-depth
                    if (field.type.startsWith('enum@')) {
                        const en = getById('enum', field.type.split('@')[1]);
                        code += `${field.name || field.readableName}: ${getTypescriptEnumName(en)};`;
                    } else {
                        code += `${field.name || field.readableName}: ${fieldTypeToTsType[field.type]};`;
                    }
                }
                code += behavior.extendTypes.split('\n').join('');
                code += '}';
            }
        }
    }
    if (asset.type === 'behavior' && (asset as IBehavior).specification.length) {
        const behavior = asset as IBehavior;
        code += '&{';
        for (const field of behavior.specification) {
            if (field.type.startsWith('enum@')) {
                const en = getById('enum', field.type.split('@')[1]);
                code += `${field.name || field.readableName}: ${getTypescriptEnumName(en)};`;
            } else {
                code += `${field.name || field.readableName}: ${fieldTypeToTsType[field.type]};`;
            }
        }
        code += behavior.extendTypes.split('\n').join('');
        code += '}';
    } else if (asset.extendTypes) {
        code += `&{${asset.extendTypes.split('\n').join('')}}`;
    }
    return code;
};

/**
 * Returns an array of field names from this asset/behavior and all the linked behaviors.
 * Mainly used for block code editor.
 */
export const getBehaviorFields = (asset: IScriptable | IScriptableBehaviors): string[] => {
    const fields: string[] = [];
    if ('behaviors' in asset) {
        for (const behaviorId of asset.behaviors) {
            const behavior = getById('behavior', behaviorId);
            if (behavior.specification.length) {
                for (const field of behavior.specification) {
                    fields.push(field.name || field.readableName);
                }
            }
        }
    }
    if (asset.type === 'behavior' && (asset as IBehavior).specification.length) {
        const behavior = asset as IBehavior;
        for (const field of behavior.specification) {
            fields.push(field.name || field.readableName);
        }
    }
    return fields;
};

const importEventsFromCatmod = (manifest: ICatmodManifest, catmodName: string): void => {
    if (manifest.events) {
        for (const eventName in manifest.events) {
            const event = manifest.events[eventName];
            const fullEventName = `${catmodName}_${eventName}`;
            events[fullEventName] = event;
        }
    }
    if (manifest.eventCategories) {
        for (const categoryName in manifest.eventCategories) {
            const eventCategory = manifest.eventCategories[categoryName];
            // Do not overwrite existing categories
            if (!(categoryName in categories)) {
                categories[categoryName] = eventCategory;
            }
        }
    }
};
import {loadModuleByName} from './../resources/modules';
const loadAllModulesEvents = async (): Promise<void> => {
    const promises = [];
    for (const libName in window.currentProject.libs) {
        promises.push(loadModuleByName(libName).then(catmod => {
            importEventsFromCatmod(catmod, libName);
        }));
    }
    await Promise.all(promises);
};
const unloadEventsFromModule = (moduleName: string): void => {
    for (const eventKey in events) {
        const [lib] = splitEventName(eventKey);
        if (lib === moduleName) {
            delete events[eventKey];
        }
    }
    // Don't quite need to remove categories;
    // empty ones will be filtered out every time an event menu is requested.
};
const unloadAllEvents = (): void => {
    for (const eventKey in events) {
        const [lib] = splitEventName(eventKey);
        if (lib !== 'core') {
            delete events[eventKey];
        }
    }
};

const canBeDynamicBehavior = (event: IEventDeclaration): boolean =>
    !event.codeTargets.some(key => key.startsWith('rootRoom'));

export {
    categories,
    events,
    bakeCategories,
    getEventByLib,
    splitEventName,
    getArgumentsTypeScript,
    localizeCategoryName,
    localizeParametrized,
    canBeDynamicBehavior,
    canUseBaseClass,
    localizeProp,
    localizeArgument,
    localizeLocalVarDesc,
    tryGetIcon,
    importEventsFromCatmod,
    importEventsFromCatmod as importEventsFromModule,
    unloadEventsFromModule,
    unloadEventsFromModule as unloadEventsFromCatmod,
    unloadAllEvents,
    loadAllModulesEvents
};

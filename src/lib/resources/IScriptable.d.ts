interface IScriptableEvent {
    /** The codename of the module that added this event, or 'core' if it is a built-in event */
    lib: 'core' | string;
    arguments: {
        [key: string]: assetRef | string | number | boolean;
    };
    /** Used for Catnip only */
    variables?: string[];
    /** The user-written JS/Civet/Catnip code */
    code: string | BlockScript;
    /** The codename of the current event, excluding the lib prefix, e.g. OnCreate */
    eventKey: string;
}

/** Describes an asset that supports scripting through ct.js events */
interface IScriptable extends IAsset {
    events: IScriptableEvent[];
    /**
     * The contents of a TypeScript typedef that is combined
     * with the base copy type of the edited asset.
     */
    extendTypes: string;
    /** Used for Catnip only */
    properties?: string[];
}

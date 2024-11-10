// ⚠️⚠️⚠️ THIS FILE IS USED IN BOTH CT.JS CLIENT LIB AND CT.IDE
// DO NOT import any other ct.release files in this one, as it will import
// the rest of the client lib and break ct.IDE.
//
// `import type` is ok.

// TODO: make a custom class that will handle the randomized sounds
// to allow making them looping while still giving the user the ability
// to stop the sound at any time.

/* eslint no-use-before-define: 0 */
import type {sound as pixiSound, filters as pixiSoundFilters, Filter, IMediaInstance, PlayOptions, Sound, SoundLibrary} from 'node_modules/@pixi/sound';
import type {webaudio} from 'node_modules/@pixi/sound/lib';
import type {ExportedSound} from '../lib/exporter/_exporterContracts';
import type {Camera} from 'camera';

import type * as pixiMod from 'pixi.js';
declare var PIXI: typeof pixiMod & {
    sound: typeof pixiSound & {
        filters: typeof pixiSoundFilters;
    }
};
declare var camera: Camera;

/* eslint-disable no-underscore-dangle */
class PannerFilter extends PIXI.sound.filters.Filter {
    private _panner: PannerNode | null;
    constructor(refDistance: number, rolloffFactor: number) {
        const {audioContext} = PIXI.sound.context;
        const panner = audioContext.createPanner();
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'inverse';
        panner.refDistance = refDistance;
        panner.rolloffFactor = rolloffFactor;
        const destination = panner;
        super(destination);
        this._panner = panner;
    }
    reposition(tracked: {x: number, y: number, kill?: boolean}): void {
        if (tracked.kill) {
            return;
        }
        this._panner!.positionX.value = tracked.x / camera.referenceLength;
        this._panner!.positionY.value = tracked.y / camera.referenceLength;
    }
    destroy() {
        super.destroy();
        this._panner = null;
    }
}
/* eslint-enable no-underscore-dangle */

/**
 * @catnipIgnore
 */
export const pannedSounds = new Map<{x: number, y: number}, PannerFilter>();

// ⚠️ DO NOT put into res.ts, see the start of the file.
/**
 * @catnipIgnore
 */
export const exportedSounds = [/*!@sounds@*/][0] as ExportedSound[] ?? [];
/**
 * All the sound data objects exported from ct.IDE, mapped by their asset name.
 * @catnipIgnore
 */
export const soundMap = {} as Record<string, ExportedSound>;
for (const exportedSound of exportedSounds) {
    soundMap[exportedSound.name] = exportedSound;
}
/**
 * A map of Sound instances of both exported sounds' variants
 * and user-loaded ones with res.loadSound.
 * @catnipIgnore
 */
export const pixiSoundInstances = {} as Record<string, Sound>;

type FilterPreserved = Filter & {
    preserved: string;
};

type fxName = Exclude<keyof typeof pixiSoundFilters, 'Filter' | 'StreamFilter'>;
const fxNames = Object.keys(PIXI.sound.filters)
.filter((name: keyof typeof pixiSoundFilters) => name !== 'Filter' && name !== 'StreamFilter');
const fxNamesToClasses = {} as {
    [T in fxName]: typeof pixiSoundFilters[T]
};
for (const fxName of fxNames) {
    fxNamesToClasses[fxName] = PIXI.sound.filters[fxName] as any;
}

/**
 * A prefix for PIXI.Loader to distinguish between sounds and other asset types like textures.
 * @catnipIgnore
 */
export const pixiSoundPrefix = 'pixiSound-';

const randomRange = (min: number, max: number): number => Math.random() * (max - min) + min;

/**
 * Applies a method onto a sound — regardless whether it is a sound exported from ct.IDE
 * (with variants) or imported by a user though `res.loadSound`.
 *
 * Ignore sounds that have not yet been loaded.
 */
const withSound = <T>(name: string, fn: (sound: Sound, assetName: string) => T): T => {
    const pixiFind = PIXI.sound.exists(name) && PIXI.sound.find(name);
    if (pixiFind) {
        return fn(pixiFind, name);
    }
    if (name in pixiSoundInstances) {
        return fn(pixiSoundInstances[name], name);
    }
    if (name in soundMap) {
        let lastVal: T;
        for (const variant of soundMap[name].variants) {
            const assetName = `${pixiSoundPrefix}${variant.uid}`;
            if (assetName in pixiSoundInstances) {
                lastVal = fn(pixiSoundInstances[assetName], assetName);
            } // ignore sound variants not yet loaded
        }
        return lastVal!;
    }
    throw new Error(`[sounds] Sound "${name}" was not found. Is it a typo?`);
};

/**
 * Plays a variant of a sound by applying randomized filters (if applicable)
 * as exported from ct.IDE.
 * @catnipIgnore
 */
export const playVariant = (
    sound: ExportedSound,
    variant: ExportedSound['variants'][0],
    options?: PlayOptions
): webaudio.WebAudioInstance => {
    const pixiSoundInst = PIXI.sound.find(`${pixiSoundPrefix}${variant.uid}`).play(options) as
        webaudio.WebAudioInstance;
    if (sound.volume?.enabled) {
        (pixiSoundInst as IMediaInstance).volume =
            randomRange(sound.volume.min, sound.volume.max) * (options?.volume || 1);
    } else if (options?.volume !== void 0) {
        (pixiSoundInst as IMediaInstance).volume = options.volume;
    }
    if (sound.pitch?.enabled) {
        (pixiSoundInst as IMediaInstance).speed =
            randomRange(sound.pitch.min, sound.pitch.max) * (options?.speed || 1);
    } else if (options?.speed !== void 0) {
        (pixiSoundInst as IMediaInstance).speed = options.speed;
    }
    if (sound.distortion?.enabled) {
        soundsLib.addDistortion(
            pixiSoundInst,
            randomRange(sound.distortion.min, sound.distortion.max)
        );
    }
    if (sound.reverb?.enabled) {
        soundsLib.addReverb(
            pixiSoundInst,
            randomRange(sound.reverb.secondsMin, sound.reverb.secondsMax),
            randomRange(sound.reverb.decayMin, sound.reverb.decayMax),
            sound.reverb.reverse
        );
    }
    if (sound.eq?.enabled) {
        soundsLib.addEqualizer(
            pixiSoundInst,
            ...(sound.eq.bands.map(band => randomRange(band.min, band.max)) as
                [number, number, number, number, number, number, number, number, number, number])
            // 🍝
        );
    }
    return pixiSoundInst;
};

/**
 * @catnipIgnore
 */
export const playWithoutEffects = (
    sound: ExportedSound,
    variant: ExportedSound['variants'][0],
    options?: PlayOptions
): webaudio.WebAudioInstance => {
    const pixiSoundInst = PIXI.sound.find(`${pixiSoundPrefix}${variant.uid}`).play(options) as
        webaudio.WebAudioInstance;
    return pixiSoundInst;
};

/**
 * @catnipIgnore
 */
export const playRandomVariant = (
    sound: ExportedSound,
    options?: PlayOptions
): webaudio.WebAudioInstance => {
    const variant = sound.variants[Math.floor(Math.random() * sound.variants.length)];
    return playVariant(sound, variant, options);
};

export const soundsLib = {
    /**
     * Preloads a sound. This is usually applied to music files before playing
     * as they are not preloaded by default.
     *
     * @param {string} name The name of a sound
     * @returns {Promise<string>} A promise that resolves into the name of the loaded sound asset.
     */
    async load(name: string): Promise<string> {
        const promises: Promise<IMediaInstance>[] = [];
        withSound(name, (soundRes, resName) => {
            const s = PIXI.sound.play(resName, {
                muted: true
            });
            if (s instanceof Promise) {
                promises.push(s);
                s.then(i => {
                    i.stop();
                });
            } else {
                s.stop();
            }
        });
        await Promise.all(promises);
        return name;
    },

    /**
     * Plays a sound.
     *
     * @param {string} name Sound's name
     * @catnipAsset name:sound
     * @param {PlayOptions} [options] Options used for sound playback.
     * @param {Function} options.complete When completed.
     * @param {number} options.end End time in seconds.
     * @param {filters.Filter[]} options.filters Filters that apply to play.
     * @param {Function} options.loaded If not already preloaded, callback when finishes load.
     * @param {boolean} options.loop Override default loop, default to the Sound's loop setting.
     * @param {boolean} options.muted If sound instance is muted by default.
     * @param {boolean} options.singleInstance Setting true will stop any playing instances.
     * @param {number} options.speed Override default speed, default to the Sound's speed setting.
     * @param {number} options.start Start time offset in seconds.
     * @param {number} options.volume Override default volume.
     * @returns Either a sound instance, or a promise that resolves into a sound instance.
     * @catnipIgnore It is defined in stdLib/sounds.ts.
     */
    play(name: string, options?: PlayOptions): Promise<IMediaInstance> | IMediaInstance {
        if (name in soundMap) {
            // Exported sounds
            const exported = soundMap[name];
            return playRandomVariant(exported, options);
        }
        if (name in pixiSoundInstances) {
            // User-loaded sounds
            return pixiSoundInstances[name].play(options);
        }
        throw new Error(`[sounds.play] Sound "${name}" was not found. Is it a typo?`);
    },
    /**
     * Plays a sound in 3D space.
     * @catnipIgnore It is defined in stdLib/sounds.ts.
     */
    playAt(
        name: string,
        position: {x: number, y: number},
        options?: PlayOptions
    ): Promise<IMediaInstance> | IMediaInstance {
        const sound = soundsLib.play(name, options);
        const {panning} = soundMap[name];
        if (sound instanceof Promise) {
            sound.then(instance => {
                soundsLib.addPannerFilter(
                    instance as webaudio.WebAudioInstance,
                    position,
                    panning.refDistance,
                    panning.rolloffFactor
                );
            });
        } else {
            soundsLib.addPannerFilter(
                sound as webaudio.WebAudioInstance,
                position,
                panning.refDistance,
                panning.rolloffFactor
            );
        }
        return sound;
    },

    /**
     * Stops a sound if a name is specified, otherwise stops all sound.
     *
     * @param {string|IMediaInstance} [name] Sound's name, or the sound instance.
     * @catnipAsset name:sound
     *
     * @returns {void}
     */
    stop(name?: string | IMediaInstance): void {
        if (name) {
            if (typeof name === 'string') {
                withSound(name, sound => sound.stop());
            } else {
                name.stop();
            }
        } else {
            PIXI.sound.stopAll();
        }
    },

    /**
     * Pauses a sound if a name is specified, otherwise pauses all sound.
     *
     * @param {string} [name] Sound's name
     * @catnipAsset name:sound
     *
     * @returns {void}
     */
    pause(name?: string): void {
        if (name) {
            withSound(name, sound => sound.pause());
        } else {
            PIXI.sound.pauseAll();
        }
    },

    /**
     * Resumes a sound if a name is specified, otherwise resumes all sound.
     *
     * @param {string} [name] Sound's name
     * @catnipAsset name:sound
     *
     * @returns {void}
     */
    resume(name?: string): void {
        if (name) {
            withSound(name, sound => sound.resume());
        } else {
            PIXI.sound.resumeAll();
        }
    },

    /**
     * Returns whether a sound with the specified name was added to the game.
     * This doesn't tell whether it is fully loaded or not, it only checks
     * for existance of sound's metadata in your game.
     *
     * @param {string} name Sound's name
     * @catnipAsset name:sound
     *
     * @returns {boolean}
     */
    exists(name: string): boolean {
        return (name in soundMap) || (name in pixiSoundInstances);
    },

    /**
     * Returns whether a sound is currently playing if a name is specified,
     * otherwise if any sound is currently playing.
     *
     * @param {string} [name] Sound's name
     * @catnipAsset name:sound
     *
     * @returns {boolean} `true` if the sound is playing, `false` otherwise.
     */
    playing(name?: string): boolean {
        if (!name) {
            return PIXI.sound.isPlaying();
        }
        if (name in pixiSoundInstances) {
            return pixiSoundInstances[name].isPlaying;
        } else if (name in soundMap) {
            for (const variant of soundMap[name].variants) {
                const instanceKey = `${pixiSoundPrefix}${variant.uid}`;
                if (instanceKey in pixiSoundInstances &&
                    pixiSoundInstances[instanceKey].isPlaying
                ) {
                    return true;
                }
            }
        } else {
            throw new Error(`[sounds] Sound "${name}" was not found. Is it a typo?`);
        }
        return false;
    },

    /**
     * Get or set the volume for a sound.
     *
     * @param {string|IMediaInstance} name Sound's name or instance
     * @catnipAsset name:sound
     * @param {number} [volume] The new volume where 1 is 100%.
     * If empty, will return the existing volume.
     *
     * @returns {number} The current volume of the sound.
     * @catnipIgnore
     */
    volume(name: string | IMediaInstance, volume?: number): number {
        if (volume !== void 0) {
            if (typeof name === 'string') {
                withSound(name, sound => {
                    sound.volume = volume;
                });
            } else {
                (name as IMediaInstance).volume = volume;
            }
        }
        if (typeof name === 'string') {
            return withSound(name, sound => sound.volume);
        }
        return (name as IMediaInstance).volume;
    },

    /**
     * Set the global volume for all sounds.
     * @param {number} value The new volume where 1 is 100%.
     */
    globalVolume(value: number): void {
        PIXI.sound.volumeAll = value;
    },

    /**
     * Fades a sound to a given volume. Can affect either a specific instance or the whole group.
     *
     * @param [name] Sound's name or instance to affect. If null, all sounds are faded.
     * @catnipAsset name:sound
     * @param [newVolume] The new volume where 1 is 100%. Default is 0.
     * @param [duration] The duration of transition, in milliseconds. Default is 1000.
     */
    fade(name?: string | IMediaInstance | SoundLibrary, newVolume = 0, duration = 1000): void {
        const start = {
            time: performance.now(),
            value: name ?
                soundsLib.volume(name as string | IMediaInstance) :
                PIXI.sound.context.volume
        };
        const updateVolume = (currentTime: number) => {
            const elapsed = currentTime - start.time;
            const progress = Math.min(elapsed / duration, 1);
            const value = start.value + (newVolume - start.value) * progress;
            if (name) {
                soundsLib.volume(name as string | IMediaInstance, value);
            } else {
                soundsLib.globalVolume(value);
            }
            if (progress < 1) {
                requestAnimationFrame(updateVolume);
            }
        };
        requestAnimationFrame(updateVolume);
    },

    /**
     * Adds a filter to the specified sound and remembers its constructor name.
     * This method is not intended to be called directly.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @catnipSaveReturn
     */
    addFilter(
        sound: false | string | Sound | webaudio.WebAudioInstance,
        filter: pixiSoundFilters.Filter,
        filterName: string
    ): void {
        const fx = filter as FilterPreserved;
        fx.preserved = filterName;
        if (sound === false) {
            PIXI.sound.filtersAll = [...(PIXI.sound.filtersAll || []), fx];
        } else if (typeof sound === 'string') {
            withSound(sound, soundInst => {
                soundInst.filters = [...(soundInst.filters || []), fx];
            });
        } else if (sound) {
            sound.filters = [...(sound.filters || []), fx];
        } else {
            throw new Error(`[sounds.addFilter] Invalid sound: ${sound}`);
        }
    },

    /**
     * Adds a distortion filter.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @param {number} amount The amount of distortion to set from 0 to 1. Default is 0.
     * @catnipSaveReturn
     */
    addDistortion(
        sound: false | string | Sound | webaudio.WebAudioInstance,
        amount: number
    ): pixiSoundFilters.DistortionFilter {
        const fx = new PIXI.sound.filters.DistortionFilter(amount);
        soundsLib.addFilter(sound, fx, 'DistortionFilter');
        return fx;
    },

    /**
     * Adds an equalizer filter.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @param {number} f32 Default gain for 32 Hz. Default is 0.
     * @param {number} f64 Default gain for 64 Hz. Default is 0.
     * @param {number} f125 Default gain for 125 Hz. Default is 0.
     * @param {number} f250 Default gain for 250 Hz. Default is 0.
     * @param {number} f500 Default gain for 500 Hz. Default is 0.
     * @param {number} f1k Default gain for 1000 Hz. Default is 0.
     * @param {number} f2k Default gain for 2000 Hz. Default is 0.
     * @param {number} f4k Default gain for 4000 Hz. Default is 0.
     * @param {number} f8k Default gain for 8000 Hz. Default is 0.
     * @param {number} f16k Default gain for 16000 Hz. Default is 0.
     * @catnipSaveReturn
     */

    /**
     * @catnipAsset sound:sound
    */
    // eslint-disable-next-line max-params
    addEqualizer(
        sound: false | string | Sound | webaudio.WebAudioInstance,
        f32: number,
        f64: number,
        f125: number,
        f250: number,
        f500: number,
        f1k: number,
        f2k: number,
        f4k: number,
        f8k: number,
        f16k: number
    ): pixiSoundFilters.EqualizerFilter {
        // eslint-disable-next-line max-len
        const fx = new PIXI.sound.filters.EqualizerFilter(f32, f64, f125, f250, f500, f1k, f2k, f4k, f8k, f16k);
        soundsLib.addFilter(sound, fx, 'EqualizerFilter');
        return fx;
    },

    /**
     * Combine all channels into mono channel.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @catnipSaveReturn
     */
    addMonoFilter(sound: false | string | Sound | webaudio.WebAudioInstance):
        pixiSoundFilters.MonoFilter {
        const fx = new PIXI.sound.filters.MonoFilter();
        soundsLib.addFilter(sound, fx, 'MonoFilter');
        return fx;
    },

    /**
     * Adds a reverb filter.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @param {number} seconds Seconds for reverb. Default is 3.
     * @param {number} decay The decay length. Default is 2.
     * @param {boolean} reverse Reverse reverb. Default is false.
     * @catnipSaveReturn
     */
    addReverb(
        sound: false | string | Sound | webaudio.WebAudioInstance,
        seconds: number,
        decay: number,
        reverse: boolean
    ): pixiSoundFilters.ReverbFilter {
        const fx = new PIXI.sound.filters.ReverbFilter(seconds, decay, reverse);
        soundsLib.addFilter(sound, fx, 'ReverbFilter');
        return fx;
    },

    /**
     * Adds a filter for stereo panning.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @param {number} pan The amount of panning: -1 is left, 1 is right. Default is 0 (centered).
     * @catnipSaveReturn
     */
    addStereoFilter(
        sound: false | string | Sound | webaudio.WebAudioInstance,
        pan: number
    ): pixiSoundFilters.StereoFilter {
        const fx = new PIXI.sound.filters.StereoFilter(pan);
        soundsLib.addFilter(sound, fx, 'StereoFilter');
        return fx;
    },

    /**
     * Adds a 3D sound filter.
     * This filter can only be applied to sound instances.
     *
     * @param sound The sound to apply effect to.
     * @catnipAsset sound:sound
     * @param position Any object with x and y properties — for example, copies.
     * @catnipSaveReturn
     */
    addPannerFilter(
        sound: webaudio.WebAudioInstance,
        position: {x: number, y: number},
        refDistance: number,
        rolloffFactor: number
    ): PannerFilter {
        const fx = new PannerFilter(refDistance, rolloffFactor);
        soundsLib.addFilter(sound, fx, 'PannerFilter');
        pannedSounds.set(position, fx);
        sound.on('end', () => {
            pannedSounds.delete(position);
        });
        return fx;
    },

    /**
     * Adds a telephone-sound filter.
     *
     * @param sound If set to false, applies the filter globally.
     * If set to a string, applies the filter to the specified sound asset.
     * If set to a media instance or PIXI.Sound instance, applies the filter to it.
     * @catnipAsset sound:sound
     * @catnipSaveReturn
     */
    addTelephone(sound: false | string | Sound | webaudio.WebAudioInstance):
        pixiSoundFilters.TelephoneFilter {
        const fx = new PIXI.sound.filters.TelephoneFilter();
        soundsLib.addFilter(sound, fx, 'TelephoneFilter');
        return fx;
    },

    /**
     * Remove a filter to the specified sound.
     *
     * @param {string} [name] The sound to affect. Can be a name of the sound asset
     * or the specific sound instance you get from running `sounds.play`.
     * If set to false, it affects all sounds.
     * @catnipAsset name:sound
     * @param {string} [filter] The name of the filter. If omitted, all the filters are removed.
     *
     * @returns {void}
     */
    removeFilter(name?: false | string | Sound | webaudio.WebAudioInstance, filter?: fxName): void {
        const setFilters = (newFilters: pixiSoundFilters.Filter[]) => {
            if (typeof name === 'string') {
                withSound(name as string, soundInst => {
                    soundInst.filters = newFilters;
                });
            } else {
                (name as Sound).filters = newFilters;
            }
        };
        // Remove all filters from all sound
        if (!name && !filter) {
            PIXI.sound.filtersAll = [];
            return;
        }
        // Remove all filters from one sound
        if (name && !filter) {
            setFilters([]);
            return;
        }
        // Remove one filter from all sound or one sound
        // Copy existing filters
        let filters: pixiSoundFilters.Filter[];
        if (!name) {
            filters = PIXI.sound.filtersAll;
        } else {
            filters = typeof name === 'string' ? withSound(name as string, soundInst => soundInst.filters) : name.filters;
        }
        if (filter && !filter.includes('Filter')) {
            filter += 'Filter';
        }
        const copy = [...filters];
        // Remove the targeted filter from the copy
        filters.forEach((f: FilterPreserved, i: number) => {
            if (f.preserved === filter) {
                copy.splice(i, 1);
            }
        });
        // Set the cleaned filters to all sound or one sound
        if (!name) {
            PIXI.sound.filtersAll = copy;
        } else {
            setFilters(copy);
        }
    },

    /**
     * Set the speed (playback rate) of a sound.
     *
     * @param {string|IMediaInstance} name Sound's name or instance
     * @catnipAsset name:sound
     * @param {number} [value] The new speed, where 1 is 100%.
     * If empty, will return the existing speed value.
     *
     * @returns {number} The current speed of the sound.
     * @catnipIgnore
     */
    speed(name: string | IMediaInstance, value?: number): number { // TODO: make an overload
        if (value) {
            if (typeof name === 'string') {
                withSound(name, sound => {
                    sound.speed = value;
                });
            } else {
                (name as IMediaInstance).speed = value;
            }
            return value;
        }
        if (typeof name === 'string') {
            if (name in soundMap) {
                // Return the speed of the first variant
                return pixiSoundInstances[soundMap[name as string].variants[0].uid].speed;
            }
            if (name in pixiSoundInstances) {
                return pixiSoundInstances[name as string].speed;
            }
            throw new Error(`[sounds.speed] Invalid sound name: ${name}. Is it a typo?`);
        }
        return name.speed;
    },

    /**
     * Set the global speed (playback rate) for all sounds.
     * @param {number} value The new speed, where 1 is 100%.
     *
     */
    speedAll(value: number): void {
        PIXI.sound.speedAll = value;
    },


    /**
    * Toggle muted property for all sounds.
    * @returns {boolean} `true` if all sounds are muted.
    */
    toggleMuteAll(): boolean {
        return PIXI.sound.toggleMuteAll();
    },

    /**
    * Toggle paused property for all sounds.
    * @returns {boolean} `true` if all sounds are paused.
    */
    togglePauseAll(): boolean {
        return PIXI.sound.togglePauseAll();
    }

};

export default soundsLib;

/* Made with ct.js http://ctjs.rocks/ */
const deadPool = []; // a pool of `kill`-ed copies for delaying frequent garbage collection
const copyTypeSymbol = Symbol('I am a ct.js copy');
setInterval(function () {
    deadPool.length = 0;
}, 1000 * 60);

/**
 * @typedef ILibMeta
 *
 * @property {string} name
 * @property {string} version
 * @property {string} [info]
 * @property {Array} authors
 */

/**
 * The ct.js library
 * @namespace
 */
const ct = {
    /**
     * An array with metadata of all the modules used in a ct.js game
     * @type {Object.<string,ILibMeta>}
     */
    libs: [/*@libs@*/][0],
    speed: [/*@maxfps@*/][0] || 60,
    types: {},
    snd: {},
    stack: [],
    fps: [/*@maxfps@*/][0] || 60,
    /**
     * A measure of how long a frame took time to draw, usually equal to 1 and larger on lags.
     * For example, if it is equal to 2, it means that the previous frame took twice as much time
     * compared to expected FPS rate.
     *
     * Use ct.delta to balance your movement and other calculations on different framerates by
     * multiplying it with your reference value.
     *
     * Note that `this.move()` already uses it, so there is no need to premultiply `this.speed` with it.
     *
     * **A minimal example:**
     * ```js
     * this.x += this.windSpeed * ct.delta;
     * ```
     *
     * @type {number}
     */
    delta: 1,
    /**
     * ct.js version in form of a string `X.X.X`.
     * @type {string}
     */
    version: '/*@ctversion@*/',
    meta: [/*@projectmeta@*/][0],
    main: {
        fpstick: 0,
        pi: 0
    },
    get width() {
        return ct.pixiApp.renderer.view.width;
    },
    /**
     * Resizes the drawing canvas and viewport to the given value in pixels.
     * When used with ct.fittoscreen, can be used to enlarge/shrink the viewport.
     * @param {number} value New width in pixels
     * @type {number}
     */
    set width(value) {
        ct.viewWidth = ct.roomWidth = value;
        if (!ct.fittoscreen || ct.fittoscreen.mode === 'fastScale') {
            ct.pixiApp.renderer.resize(value, ct.height);
        }
        if (ct.fittoscreen) {
            ct.fittoscreen();
        }
        return value;
    },
    get height() {
        return ct.pixiApp.renderer.view.height;
    },
    /**
     * Resizes the drawing canvas and viewport to the given value in pixels.
     * When used with ct.fittoscreen, can be used to enlarge/shrink the viewport.
     * @param {number} value New height in pixels
     * @type {number}
     */
    set height(value) {
        ct.viewHeight = ct.roomHeight = value;
        if (!ct.fittoscreen || ct.fittoscreen.mode === 'fastScale') {
            ct.pixiApp.renderer.resize(ct.width, value);
        }
        if (ct.fittoscreen) {
            ct.fittoscreen();
        }
        return value;
    },
    /**
     * The width of the current view, in game units
     * @type {number}
     */
    viewWidth: null,
    /**
     * The height of the current view, in game units
     * @type {number}
     */
    viewHeight: null
};

// eslint-disable-next-line no-console
console.table({
    '😺 Made with:': 'ct.js game editor',
    '🙀 Version:': `v${ct.version}`,
    '😻 Website:': 'https://ctjs.rocks/',
});

ct.highDensity = [/*@highDensity@*/][0];
/**
 * The PIXI.Application that runs ct.js game
 * @type {PIXI.Application}
 */
ct.pixiApp = new PIXI.Application({
    width: [/*@startwidth@*/][0],
    height: [/*@startheight@*/][0],
    antialias: ![/*@pixelatedrender@*/][0],
    powerPreference: 'high-performance',
    sharedTicker: true,
    sharedLoader: true
});
PIXI.settings.ROUND_PIXELS = [/*@pixelatedrender@*/][0];
PIXI.Ticker.shared.maxFPS = [/*@maxfps@*/][0] || 0;
if (!ct.pixiApp.renderer.options.antialias) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
}
/**
 * @type PIXI.Container
 */
ct.stage = ct.pixiApp.stage;
ct.pixiApp.renderer.autoDensity = ct.highDensity;
document.getElementById('ct').appendChild(ct.pixiApp.view);

/**
 * A library of different utility functions, mainly Math-related, but not limited to them.
 * @namespace
 */
ct.u = {
    /**
     * Returns the length of a vector projection onto an X axis.
     * @param {number} l The length of the vector
     * @param {number} d The direction of the vector
     * @returns {number} The length of the projection
     */
    ldx(l, d) {
        return l * Math.cos(d * Math.PI / -180);
    },
    /**
     * Returns the length of a vector projection onto an Y axis.
     * @param {number} l The length of the vector
     * @param {number} d The direction of the vector
     * @returns {number} The length of the projection
     */
    ldy(l, d) {
        return l * Math.sin(d * Math.PI / -180);
    },
    /**
     * Returns the direction of a vector that points from the first point to the second one.
     * @param {number} x1 The x location of the first point
     * @param {number} y1 The y location of the first point
     * @param {number} x2 The x location of the second point
     * @param {number} y2 The y location of the second point
     * @returns {number} The angle of the resulting vector, in degrees
     */
    pdn(x1, y1, x2, y2) {
        return (Math.atan2(y2 - y1, x2 - x1) * -180 / Math.PI + 360) % 360;
    },
    // Point-point DistanCe
    /**
     * Returns the distance between two points
     * @param {number} x1 The x location of the first point
     * @param {number} y1 The y location of the first point
     * @param {number} x2 The x location of the second point
     * @param {number} y2 The y location of the second point
     * @returns {number} The distance between the two points
     */
    pdc(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },
    /**
     * Convers degrees to radians
     * @param {number} deg The degrees to convert
     * @returns {number} The resulting radian value
     */
    degToRad(deg) {
        return deg * Math.PI / -180;
    },
    /**
     * Convers radians to degrees
     * @param {number} rad The radian value to convert
     * @returns {number} The resulting degree
     */
    radToDeg(rad) {
        return rad / Math.PI * -180;
    },
    /**
     * Rotates a vector (x; y) by `deg` around (0; 0)
     * @param {number} x The x component
     * @param {number} y The y component
     * @param {number} deg The degree to rotate by
     * @returns {Array<number>} A pair of new `x` and `y` parameters.
     */
    rotate(x, y, deg) {
        return ct.u.rotateRad(x, y, ct.u.degToRad(deg));
    },
    /**
     * Rotates a vector (x; y) by `rad` around (0; 0)
     * @param {number} x The x component
     * @param {number} y The y component
     * @param {number} rad The radian value to rotate around
     * @returns {Array<number>} A pair of new `x` and `y` parameters.
     */
    rotateRad(x, y, rad) {
        const sin = Math.sin(rad),
              cos = Math.cos(rad);
        return [
            cos * x - sin * y,
            cos * y + sin * x
        ];
    },
    /**
     * Gets the most narrow angle between two vectors of given directions
     * @param {number} dir1 The direction of the first vector
     * @param {number} dir2 The direction of the second vector
     * @returns {number} The resulting angle
     */
    deltaDir(dir1, dir2) {
        dir1 = ((dir1 % 360) + 360) % 360;
        dir2 = ((dir2 % 360) + 360) % 360;
        var t = dir1,
            h = dir2,
            ta = h - t;
        if (ta > 180) {
            ta -= 360;
        }
        if (ta < -180) {
            ta += 360;
        }
        return ta;
    },
    /**
     * Returns a number in between the given range (clamps it).
     * @param {number} min The minimum value of the given number
     * @param {number} val The value to fit in the range
     * @param {number} max The maximum value of the given number
     * @returns {number} The clamped value
     */
    clamp(min, val, max) {
        return Math.max(min, Math.min(max, val));
    },
    /**
     * Linearly interpolates between two values by the apha value.
     * Can also be describing as mixing between two values with a given proportion `alpha`.
     * @param {number} a The first value to interpolate from
     * @param {number} b The second value to interpolate to
     * @param {number} alpha The mixing value
     * @returns {number} The result of the interpolation
     */
    lerp(a, b, alpha) {
        return a + (b-a)*alpha;
    },
    /**
     * Returns the position of a given value in a given range. Opposite to linear interpolation.
     * @param  {number} a The first value to interpolate from
     * @param  {number} b The second value to interpolate top
     * @param  {number} val The interpolated values
     * @return {number} The position of the value in the specified range. When a <= val <= b, the result will be inside the [0;1] range.
     */
    unlerp(a, b, val) {
        return (val - a) / (b - a);
    },
    /**
     * Tests whether a given point is inside the given rectangle (it can be either a copy or an array)
     * @param {number} x The x coordinate of the point
     * @param {number} y The y coordinate of the point
     * @param {(Copy|Array<Number>)} arg Either a copy (it must have a rectangular shape) or an array in a form of [x1, y1, x2, y2], where (x1;y1) and (x2;y2) specify the two opposite corners of the rectangle
     * @returns {boolean} `true` if the point is inside the rectangle, `false` otherwise
     */
    prect(x, y, arg) {
        var xmin, xmax, ymin, ymax;
        if (arg.splice) {
            xmin = Math.min(arg[0], arg[2]);
            xmax = Math.max(arg[0], arg[2]);
            ymin = Math.min(arg[1], arg[3]);
            ymax = Math.max(arg[1], arg[3]);
        } else {
            xmin = arg.x - arg.shape.left * arg.scale.x;
            xmax = arg.x + arg.shape.right * arg.scale.x;
            ymin = arg.y - arg.shape.top * arg.scale.y;
            ymax = arg.y + arg.shape.bottom * arg.scale.y;
        }
        return x >= xmin && y >= ymin && x <= xmax && y <= ymax;
    },
    /**
     * Tests whether a given point is inside the given circle (it can be either a copy or an array)
     * @param {number} x The x coordinate of the point
     * @param {number} y The y coordinate of the point
     * @param {(Copy|Array<Number>)} arg Either a copy (it must have a circular shape) or an array in a form of [x1, y1, r], where (x1;y1) define the center of the circle and `r` defines the radius of it
     * @returns {boolean} `true` if the point is inside the circle, `false` otherwise
     */
    pcircle(x, y, arg) {
        if (arg.splice) {
            return ct.u.pdc(x, y, arg[0], arg[1]) < arg[2];
        }
        return ct.u.pdc(0, 0, (arg.x - x) / arg.scale.x, (arg.y - y) / arg.scale.y) < arg.shape.r;
    },
    /**
     * Copies all the properties of the source object to the destination object. This is **not** a deep copy. Useful for extending some settings with default values, or for combining data.
     * @param {object} o1 The destination object
     * @param {object} o2 The source object
     * @param {any} [arr] An optional array of properties to copy. If not specified, all the properties will be copied.
     * @returns {object} The modified destination object
     */
    ext (o1, o2, arr) {
        if (arr) {
            for (const i in arr) {
                if (o2[arr[i]]) {
                    o1[arr[i]] = o2[arr[i]];
                }
            }
        } else {
            for (const i in o2) {
                o1[i] = o2[i];
            }
        }
        return o1;
    },
    /**
     * Loads and executes a script by its URL, optionally with a callback
     * @param {string} url The URL of the script file, with its extension. Can be relative or absolute
     * @param {Function} callback An optional callback that fires when the script is loaded
     * @returns {void}
     */
    load(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        if (callback) {
            script.onload = callback;
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    /**
     * Returns a Promise that resolves after the given time
     * @param {number} time Time to wait, in milliseconds
     * @returns {Promise<void>} The promise with no data
     */
    wait(time) {
        var room = ct.room.name;
        return new Promise((resolve, reject) => setTimeout(() => {
            if (ct.room.name === room) {
                resolve();
            } else {
                reject({
                    info: 'Room switch',
                    from: 'ct.u.wait'
                });
            }
        }, time));
    }
};
ct.u.ext(ct.u, {// make aliases
    lengthDirX: ct.u.ldx,
    lengthDirY: ct.u.ldy,
    pointDirection: ct.u.pdn,
    pointDistance: ct.u.pdc,
    pointRectangle: ct.u.prect,
    pointCircle: ct.u.pcircle,
    extend: ct.u.ext
});

(() => {
    const removeKilledCopies = (array) => {
        let j = 0;
        for (let i = 0; i < array.length; i++) {
            if (!array[i].kill) {
                array[j++] = array[i];
            }
        }
        array.length = j;
        return array;
    };
    const killRecursive = copy => {
        copy.kill = true;
        ct.types.onDestroy.apply(copy);
        copy.onDestroy.apply(copy);
        for (const child of copy.children) {
            if (child[copyTypeSymbol]) {
                killRecursive(child);
            }
        }
    };
    const manageCamera = () => {
        const r = ct.room;
        if (r.follow) {
            const speed = Math.min(1, (1-r.followDrift)*ct.delta);
            if (r.follow.kill) {
                delete r.follow;
            } else if (r.center) {
                r.x += speed * (r.follow.x + r.followShiftX - r.x - ct.viewWidth / 2);
                r.y += speed * (r.follow.y + r.followShiftY - r.y - ct.viewHeight / 2);
            } else {
                let cx = 0,
                    cy = 0,
                    w = 0,
                    h = 0;
                w = Math.min(r.borderX, ct.viewWidth / 2);
                h = Math.min(r.borderY, ct.viewHeight / 2);
                if (r.follow.x + r.followShiftX - r.x < w) {
                    cx = r.follow.x + r.followShiftX - r.x - w;
                }
                if (r.follow.y + r.followShiftY - r.y < h) {
                    cy = r.follow.y + r.followShiftY - r.y - h;
                }
                if (r.follow.x + r.followShiftX - r.x > ct.viewWidth - w) {
                    cx = r.follow.x + r.followShiftX - r.x - ct.viewWidth + w;
                }
                if (r.follow.y + r.followShiftY - r.y > ct.viewHeight - h) {
                    cy = r.follow.y + r.followShiftY - r.y - ct.viewHeight + h;
                }
                r.x = Math.floor(r.x + speed * cx);
                r.y = Math.floor(r.y + speed * cy);
            }
        }
        r.x = r.x || 0;
        r.y = r.y || 0;
        r.x = Math.round(r.x);
        r.y = Math.round(r.y);
    };

    ct.loop = function(delta) {
        ct.delta = delta;
        ct.inputs.updateActions();
        for (let i = 0, li = ct.stack.length; i < li; i++) {
            ct.types.beforeStep.apply(ct.stack[i]);
            ct.stack[i].onStep.apply(ct.stack[i]);
            ct.types.afterStep.apply(ct.stack[i]);
        }
        // There may be a number of rooms stacked on top of each other.
        // Loop through them and filter out everything that is not a room.
        for (const item of ct.stage.children) {
            // the Room class is not visible, so we have to access it in another way.
            if (!(item instanceof Room)) {
                continue;
            }
            ct.rooms.beforeStep.apply(item);
            item.onStep.apply(item);
            ct.rooms.afterStep.apply(item);
        }
        // copies
        for (let i = 0; i < ct.stack.length; i++) {
            // eslint-disable-next-line no-underscore-dangle
            if (ct.stack[i].kill && !ct.stack[i]._destroyed) {
                killRecursive(ct.stack[i]); // This will also allow a parent to eject children to a new container before they are destroyed as well
                ct.stack[i].destroy({children: true});
            }
        }
        for (const copy of ct.stack) {
            // eslint-disable-next-line no-underscore-dangle
            if (copy._destroyed) {
                deadPool.push(copy);
            }
        }
        removeKilledCopies(ct.stack);

        // ct.types.list[type: String]
        for (const i in ct.types.list) {
            removeKilledCopies(ct.types.list[i]);
        }

        for (const cont of ct.stage.children) {
            cont.children.sort((a, b) =>
                ((a.depth || 0) - (b.depth || 0)) || ((a.uid || 0) - (b.uid || 0)) || 0
            );
        }

        manageCamera();

        for (let i = 0, li = ct.stack.length; i < li; i++) {
            ct.types.beforeDraw.apply(ct.stack[i]);
            ct.stack[i].onDraw.apply(ct.stack[i]);
            ct.types.afterDraw.apply(ct.stack[i]);
            ct.stack[i].xprev = ct.stack[i].x;
            ct.stack[i].yprev = ct.stack[i].y;
        }

        ct.rooms.beforeDraw.apply(ct.room);
        ct.room.onDraw.apply(ct.room);
        ct.rooms.afterDraw.apply(ct.room);

        ct.main.fpstick++;
        if (ct.rooms.switching) {
            ct.rooms.forceSwitch();
        }
    };
})();


/*%load%*/

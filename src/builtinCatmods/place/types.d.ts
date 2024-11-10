interface IShape {
    type: 'strip' | 'line' | 'circle' | 'rect' | 'point';
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    r?: number;
    left?: number;
    top?: number;
    bottom?: number;
    right?: number;
    points?: ISimplePoint[];
}
interface IShapeBearer {
    shape: IShape;
    x: number;
    y: number;
    scale: ISimplePoint;
    rotation: number;
    angle: number;
}
interface ICtPlaceLineSegment {
    /** The horizontal coordinate of the starting point of the ray. */
    x1: number,
    /** The vertical coordinate of the starting point of the ray. */
    y1: number,
    /** The horizontal coordinate of the ending point of the ray. */
    x2: number,
    /** The vertical coordinate of the ending point of the ray. */
    y2: number
}
interface ICtPlaceRectangle {
    /** The left side of the rectangle. */
    x1?: number,
    /** The upper side of the rectangle. */
    y1?: number,
    /** The right side of the rectangle. */
    x2?: number,
    /** The bottom side of the rectangle. */
    y2?: number,
    /** The left side of the rectangle. */
    x?: number,
    /** The upper side of the rectangle. */
    y?: number,
    /** The right side of the rectangle. */
    width?: number,
    /** The bottom side of the rectangle. */
    height?: number
}
interface ICtPlaceCircle {
    /** The horizontal coordinate of the circle's center. */
    x: number,
    /** The vertical coordinate of the circle's center. */
    y: number,
    /** The radius of the circle. */
    radius: number
}

interface IPoint {
    x: number;
    y: number;
}
interface ISeparateMovementResult {
    x: boolean | Copy;
    y: boolean | Copy;
}

declare namespace place {

    /**
     * Checks a collision between two objects, for example between two copies.
     * @param {IShapeBearer} c1 The first object to check collision with
     * @param {IShapeBearer} c2 The second object to check collision against
     *
     * @catnipLabel are colliding
     * @catnipLabel_Ru сталкиваются
     * @catnipIcon copy
     *
     * @returns {boolean} `true` if there was a collision, `false` otherwise
     */
    function collide(c1: IShapeBearer, c2: IShapeBearer): boolean;

    /**
     * Checks whether there is a free place at (x;y) for a copy `me`.
     * `cgroup` is optional and filters by using collision groups.
     * If `x` and `y` are skipped, the current coordinates of `me` will be used.
     *
     * Returns `true` if a place is free, and `false` otherwise.
     *
     * @param {Copy} me The object to check collisions on
     * @param {number} x The x coordinate to check, as if `me` was placed there.
     * @param {number} y The y coordinate to check, as if `me` was placed there.
     * @param {String} [cgroup] The collision group to check against
     * @catnipName place is free for copy
     * @catnipName_Ru место для копии свободно
     */
    function free(me: Copy, x: number, y: number, cgroup?: string): boolean;

    /**
     * Checks whether a copy `me` is in a free spot.
     * `cgroup` is optional and filters by using collision groups.
     *
     * Returns `true` if a place is free, and `false` otherwise.
     *
     * @param {Copy} me The object to check collisions on
     * @param {String} [cgroup] The collision group to check against
     * @catnipName place is free for copy
     * @catnipName_Ru место для копии свободно
     */
    function free(me: Copy, cgroup?: string): boolean;

    /**
     * Determines if the place in (x,y) is occupied.
     * Optionally can take 'cgroup' as a filter for obstacles' collision group (not shape type)
     *
     * @param {Copy} me The object to check collisions on
     * @param {number} x The x coordinate to check, as if `me` was placed there
     * @param {number} y The y coordinate to check, as if `me` was placed there
     * @param {String} [cgroup] The collision group to check against
     * @returns {Copy|PIXI.Sprite|false} The collided copy or tile, or `false`
     * if there is no collision.
     * @catnipName occupying object for
     * @catnipName_Ru занимает место для
     */
    function occupied(me: Copy, x: number, y: number, cgroup?: string):
        Copy | PIXI.Sprite | false;

    /**
     * Determines if the copy is in an occupied place.
     * Optionally can take 'cgroup' as a filter for obstacles' collision group.
     *
     * @param {Copy} me The object to check collisions on
     * @param {String} [cgroup] The collision group to check against
     * @returns {Copy|PIXI.Sprite|false} The collided copy, or `false`
     * if there were no collisions.
     * @catnipName occupying object for
     * @catnipName_Ru занимает место для
     */
    function occupied(me: Copy, cgroup?: string): Copy | false;
    /**
     * @catnipName all occupying for
     * @catnipName_Ru все занимающие место для
     */
    function occupiedMultiple(me: Copy, cgroup?: string): Array<Copy|PIXI.Sprite> | false;
    function occupiedMultiple(me: Copy, x: number, y: number, cgroup?: string):
        Array<Copy|PIXI.Sprite> | false;

    /**
     * Checks whether there is a collision between a Copy `me` and any of the Copies
     * of a given `template`. If `x` and `y` are skipped,
     * the current coordinates of `me` will be used.
     *
     * If `multiple` is `true`, the function will find all the possible collisions,
     * and will always return an array, which is either empty or filled with collided copies.
     * Otherwise, it returns `false` or the first Copy which blocked `me`.
     *
     * @param {Copy} me The object to check collisions on
     * @param {number} x The x coordinate to check, as if `me` was placed there
     * @param {number} y The y coordinate to check, as if `me` was placed there
     * @param {String} [template] The name of the template to check against
     * @catnipAsset template:template
     * @returns {Copy|false} The collided copy or `false`, if there was no collision.
     * @catnipName occupied by a template
     * @catnipName_Ru занято шаблоном
     */
    function meet(me: Copy, x: number, y: number, template: string): Copy | false;
    /**
     * Checks whether there is a collision between a Copy `me` and any of the Copies
     * of a given `template`.
     *
     * @param {Copy} me The object to check collisions on
     * @param {String} [template] The name of the template to check agains
     * @catnipAsset template:template
     * @returns {Copy|Array<Copy>} The collided copy or `false`, if there was no collision.
     * @catnipName occupied by a template
     * @catnipName_Ru занято шаблоном
     */
    function meet(me: Copy, template: string): Copy | false;
    /**
     * @catnipName all template's occupying copies
     * @catnipName_Ru все занимающие место копии шаблона
     */
    function meetMultiple(me: Copy, template: string): Array<Copy>;
    function meetMultiple(me: Copy, x: number, y: number, template: string):Array<Copy>;

    /**
     * Checks for a collision between a copy `me` and tiles of a given collision group
     * (`cgroup`).
     *
     * If `x` and `y` are skipped, the current coordinates of `me` will be used.
     *
     * This method returns either the tile that collided with the copy,
     * or `false` if there was no collision.
     *
     * @param {Copy} me The copy to calculate collisions for
     * @param {number} [x] The x coordinate to check, as if `me` was placed there.
     * @param {number} [y] The y coordinate to check, as if `me` was placed there.
     * @param {number} cgroup The collision group of tile layers to test against.
     * @catnipName occupied by a tile
     * @catnipName_Ru занято плиткой
     */
    function tiles(me: Copy, x: number, y: number, cgroup: string): false|PIXI.Sprite;
    function tiles(me: Copy, cgroup: string): false|PIXI.Sprite;
    /**
     * @catnipName all occupying tiles
     * @catnipName_Ru все занимающие место плитки
     */
    function tilesMultiple(me: Copy, x: number, y: number, cgroup: string): false|PIXI.Sprite[];
    function tilesMultiple(me: Copy, cgroup: string): false|PIXI.Sprite[];

    /**
     * Checks for a collision between a copy `me` and copies of a given collision group
     * (`cgroup`).
     *
     * If `x` and `y` are skipped, the current coordinates of `me` will be used.
     *
     * This method returns either the copy that collided with the given one,
     * or `false` if there was no collision.
     *
     * @param {Copy} me The copy to calculate collisions for
     * @param {number} [x] The x coordinate to check, as if `me` was placed there.
     * @param {number} [y] The y coordinate to check, as if `me` was placed there.
     * @param {number} cgroup The collision group of tile layers to test against.
     * @catnipName occupied by a copy
     * @catnipName_Ru занято копией
     */
    function copies(me: Copy, x: number, y: number, cgroup: string): false|Copy;
    function copies(me: Copy, cgroup: string): false|Copy;
    /**
     * @catnipName all occupying copies
     * @catnipName_Ru все занимающие место копии
     */
    function copiesMultiple(me: Copy, x: number, y: number, cgroup: string): false|Copy[];
    function copiesMultiple(me: Copy, cgroup: string): false|Copy[];

    /**
     * Returns the latest distance after calling `ct.place.furthest` or `ct.place.nearest`.
     * @catnipName last distance
     * @catnipName_Ru последнее расстояние
     */
    var lastdist: number;

    /**
     * Gets the nearest Copy of a given `template`.
     * @param {number} x The horizontal position of the starting point
     * @param {number} y The vertical position of the starting point
     * @param {string} template The name of the template against which copies
     * the distance will be measured
     * @catnipAsset template:template
     * @catnipName nearest copy to point
     * @catnipName_Ru ближайшая копия к точке
     */
    function nearest(x: number, y: number, template: string): Copy | false;

    /**
     * Gets the furthest Copy of a given `template`.
     * @param {number} x The horizontal position of the starting point
     * @param {number} y The vertical position of the starting point
     * @param {string} template The name of the template against which copies
     * the distance will be measured
     * @catnipAsset template:template
     * @catnipName furthest copy to point
     * @catnipName_Ru самая дальняя копия к точке
     */
    function furthest(x: number, y: number, template: string): Copy | false;

    /**
     * Moves a copy by `stepSize` in a given `direction` untill a `maxLength` is reached
     * or a copy is next to an obstacle. You can filter collided copies and tiles with `cgroup`,
     * and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement).
     * This function is especially useful for side-view games and any fast-moving copies,
     * as it allows precise movement without clipping or passing through surfaces.
     *
     * @param {Copy} me The copy that needs to be moved
     * @param {number} direction The direction in which to perform a movement
     * @param {number} maxLength The maximum distance a copy can traverse
     * @param {string} [cgroup] A collision group to test against.
     * Tests against every copy if no collision group was specified
     * @param {number} [stepSize=1] Precision of movement
     * @returns {Copy|boolean} If there was no collision and a copy reached its target,
     * returns `false`. If a copy met an obstacle as another copy, returns this copy.
     * If there was a tile, returns `true`.
     *
     * @catnipIgnore
     */
    function moveAlong(
        me: Copy, direction: number, maxLength: number, cgroup?: string, stepSize?: number
    ): Copy | boolean;

    /**
     * Similar to ct.place.moveAlong, this method moves a copy by X and Y axes until dx and dy
     * are reached or a copy meets an obstacle on both axes. If an obstacle was met on one axis,
     * a copy may continue moving by another axis. You can filter collided copies with `cgroup`,
     * and set precision with `stepSize` (default is `1`, which means pixel-by-pixel movement).
     * This movement suits characters in top-down and side-view worlds.
     *
     * @param {Copy} me The copy that needs to be moved
     * @param {number} dx Amount of pixels to move by X axis
     * @param {number} dy Amount of pixels to move by Y axis
     * @param {string} [cgroup] A collision group to test against.
     * Tests against every copy if no collision group was specified
     * @param {number} [stepSize=1] Precision of movement
     * @returns {false|ISeparateMovementResult} `false` if it reached its target,
     * an object with each axis specified otherwise.
     *
     * @catnipIgnore
     */
    function moveByAxes(me: Copy, dx: number, dy: number, cgroup?: string, stepSize?: number):
        false | ISeparateMovementResult;

    /**
     * Tries to reach the target with a simple obstacle avoidance algorithm.
     *
     * `me` is a copy to move around, `x` and `y` is a target point;
     * `length` is the maximum amount of pixels to move in one step.
     * `cgroup` is an option parameter that tells to test collisions against
     * a certain collision group.
     *
     * This function doesn't require the `ct.templates.move(this);` call.
     *
     * @param {Copy} me The copy to move
     * @param {number} x The target x coordinate to reach
     * @param {number} y The target y coordinate to reach
     * @param {number} length The maximum number to move to in one step
     * (usually the speed of a copy)
     * @param {string} cgroup The collision group to test against. If not defined,
     * will test against all the copies
     * @catnipName Move a copy avoiding obstacles
     * @catnipName_Ru Передвинуть копию, обходя препятствия
     */
    function go(me: Copy, x: number, y: number, length: number, cgroup?: string): void;


    /**
     * Tests for intersections with a line segment.
     * If `getAll` is set to `true`, returns all the copies and tiles that intersect
     * the line segment; otherwise, returns the first one that fits the conditions.
     *
     * @param {ICtPlaceLineSegment} line An object that describes the line segment.
     * @param {string} [cgroup] An optional collision group to trace against.
     * If omitted, will trace through all the copies in the current room.
     * @param {boolean} [getAll] Whether to return all the intersections (true),
     * or return the first one.
     * @catnipName trace a line
     * @catnipName_Ru проброс линии
     */
    function traceLine(line: ICtPlaceLineSegment, cgroup: string|false, getAll: true):
        Array<Copy|PIXI.Sprite>;
    function traceLine(line: ICtPlaceLineSegment, cgroup: string|false, getAll?: false):
        Copy|PIXI.Sprite|false;

    /**
     * Tests for intersections with a filled rectangle.
     * If `getAll` is set to `true`, returns all the copies and tiles that intersect
     * the rectangle; otherwise, returns the first one that fits the conditions.
     *
     * @param {ICtPlaceRectangle} rect An object that describes the line segment.
     * @param {string} [cgroup] An optional collision group to trace against.
     * If omitted, will trace through all the copies in the current room.
     * @param {boolean} [getAll] Whether to return all the intersections (true),
     * or return the first one.
     * @catnipName trace a rectangle
     * @catnipName_Ru проброс прямоугольником
     */
    function traceRect(rect: ICtPlaceRectangle, cgroup: string, getAll: true):
        Array<Copy|PIXI.Sprite>;
    function traceRect(rect: ICtPlaceRectangle, cgroup: string, getAll?: false):
        Copy|PIXI.Sprite|false;

    /**
     * Tests for intersections with a filled circle.
     * If `getAll` is set to `true`, returns all the copies and tiles that intersect
     * the circle; otherwise, returns the first one that fits the conditions.
     *
     * @param {ICtPlaceCircle} rect An object that describes the line segment.
     * @param {string} [cgroup] An optional collision group to trace against.
     * If omitted, will trace through all the copies in the current room.
     * @param {boolean} [getAll] Whether to return all the intersections (true),
     * or return the first one.
     * @catnipName trace a circle
     * @catnipName_Ru проброс круга
     */
    function traceCircle(circle: ICtPlaceCircle, cgroup: string|false, getAll: true):
        Array<Copy|PIXI.Sprite>;
    function traceCircle(circle: ICtPlaceCircle, cgroup: string|false, getAll?: false):
        Copy|PIXI.Sprite|false;

    /**
     * Tests for intersections with a polyline. It is a hollow shape made
     * of connected line segments. The shape is not closed unless you add
     * the closing point by yourself.
     * If `getAll` is set to `true`, returns all the copies and tiles that intersect
     * the polyline; otherwise, returns the first one that fits the conditions.
     *
     * @param {Array<IPoint>} polyline An array of objects with `x` and `y` properties.
     * @param {string} [cgroup] An optional collision group to trace against.
     * If omitted, will trace through all the copies in the current room.
     * @param {boolean} [getAll] Whether to return all the intersections (true),
     * or return the first one.
     * @catnipName trace a polyline
     * @catnipName_Ru проброс ломаной линии
     */
    function tracePolyline(polyline: Array<IPoint>, cgroup: string|false, getAll: true):
        Array<Copy|PIXI.Sprite>;
    function tracePolyline(polyline: Array<IPoint>, cgroup: string|false, getAll?: false):
        Copy|PIXI.Sprite|false;

    /**
     * Tests for intersections with a point.
     * If `getAll` is set to `true`, returns all the copies and tiles that intersect
     * the point; otherwise, returns the first one that fits the conditions.
     *
     * @param {object} point An object with `x` and `y` properties.
     * @param {string} [cgroup] An optional collision group to trace against.
     * If omitted, will trace through all the copies in the current room.
     * @param {boolean} [getAll] Whether to return all the intersections (true),
     * or return the first one.
     * @catnipName trace a point
     * @catnipName_Ru проброс точки
     */
    function tracePoint(point: IPoint, cgroup: string|false, getAll: true):
        Array<Copy|PIXI.Sprite>;
    function tracePoint(point: IPoint, cgroup: string|false, getAll?: false):
        Copy|PIXI.Sprite|false;

    /**
     * Enables collision checks on the specified tilemap, with an optional collision group.
     * @param {Tilemap} tilemap The tilemap on which to enable collisions.
     * @param {string} cgroup Collision group.
     * @catnipName Enable tilemap collisions
     * @catnipName_Ru Включить столкновения у слоя тайлов
     */
    function enableTilemapCollisions(tilemap: Tilemap, cgroup?: string): void;
}

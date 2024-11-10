declare type PointerButtonName = 'Primary' | 'Middle' | 'Secondary' | 'ExtraOne' | 'ExtraTwo' | 'Eraser';

interface IPointer {
    /** A unique number that identifies a pointer; */
    id: number;
    /** Pointer type. It is usually one of the following: 'mouse', 'pen', or 'touch'. */
    type: string;

    /** The horizontal position at which a pointer is positioned. */
    x: number;
    /** The vertical position at which a pointer is positioned. */
    y: number;
    /** The horizontal position at which a pointer is positioned, in UI space.*/
    xui: number;
    /** The vertical position at which a pointer is positioned, in UI space.*/
    yui: number;

    /**
     * The horizontal position of the pointer in the previous frame, in gameplay coordinates.
     */
    xprev: number,
    /**
     * The vertical position of the pointer in the previous frame, in gameplay coordinates.
     */
    yprev: number,
    /**
     * The horizontal position of the pointer in the previous frame, in UI coordinates.
     */
    xuiprev: number,
    /**
     * The vertical position of the pointer in the previous frame, in UI coordinates.
     */
    yuiprev: number,

    /**
     * Raw clientX property of a pointer. Note that it corresponds neither to gameplay
     * nor to UI coordinates, and thus should not be used for gameplay code.
     */
    clientX: number;
    /**
     * Raw clientY property of a pointer. Note that it corresponds neither to gameplay
     * nor to UI coordinates, and thus should not be used for gameplay code.
     */
    clientY: number;

    /**
     * The size of a pointer, in UI coordinates.
     * Sometimes this property is not available and is equal to 0 or something close to 1.
     */
    width: number;
    /**
     * The size of a pointer, in UI coordinates.
     * Sometimes this property is not available and is equal to 0 or something close to 1.
     */
    height: number;
    /** The horizontal position at which a pointer was positioned in the previous frame. */

    /**
     * A number that, with a proper bitmask, tells which buttons are currently pressed.
     * Use ct.pointer.isButtonPressed(buttonName, pointer.buttons) to check
     * for specific buttons.
     */
    buttons: number;

    /**
     * The current pressure made onto the pointer.
     * Note that this property is usually defined for special pointer types,
     * e.g. for graphic tablet's digital pens.
     * You will usually get 0.5 for mouse and touch events of regular devices.
     */
    pressure: number;

    /**
     * The plane angle (in degrees, in the range of -90 to 90) between the Y–Z plane and the plane
     * containing both the pointer (e.g. pen stylus) axis and the Y axis.
     */
    tiltX: number;
    /**
     * the plane angle (in degrees, in the range of -90 to 90) between the X–Z plane and the plane
     * containing both the pointer (e.g. pen stylus) axis and the X axis.
     */
    tiltY: number;
    /**
     * The clockwise rotation of the pointer (e.g. pen stylus) around its major axis in degrees,
     * with a value in the range 0 to 359.
     */
    twist: number;

}

declare namespace pointer {
    /**
     * @catnipIgnore
     */
    var hover: IPointer[];
    /**
     * @catnipIgnore
     */
    var down: IPointer[];
    /**
     * @catnipIgnore
     */
    var released: IPointer[];
    /**
     * The horizontal position at which the primary pointer is positioned.
     * @catnipName pointer's x
     * @catnipName_Ru x указателя
     */
    var x: number;
    /**
     * The vertical position at which the primary pointer is positioned.
     * @catnipName pointer's y
     * @catnipName_Ru y указателя
     */
    var y: number;
    /**
     * The horizontal position at which the primary pointer is positioned, in UI space.
     * @catnipName pointer's x for ui
     * @catnipName_Ru x указателя для ui
     */
    var xui: number;
    /**
     * The vertical position at which the primary pointer is positioned, in UI space.
     * @catnipName pointer's y for ui
     * @catnipName_Ru y указателя для ui
     */
    var yui: number;
    /**
     * The horizontal position of the primary pointer in the previous frame,
     * in gameplay coordinates.
     * @catnipName pointer's previous x
     * @catnipName_Ru предыдущий x указателя
     */
    var xprev: number;
    /**
     * The vertical position of the primary pointer in the previous frame,
     * in gameplay coordinates.
     * @catnipName pointer's previous y
     * @catnipName_Ru предыдущий y указателя
     */
    var yprev: number;
    /**
     *
     * The horizontal position of the primary pointer in the previous frame, in UI coordinates.
     * @catnipName pointer's previous x in ui
     * @catnipName_Ru предыдущий x указателя в ui
     */
    var xuiprev: number;
    /**
     * The vertical position of the primary pointer in the previous frame, in UI coordinates.
     * @catnipName pointer's previous y in ui
     * @catnipName_Ru предыдущий y указателя в ui
     */
    var yuiprev: number;
    /**
     * The current tracked position of a locked pointer in UI space.
     * Note that it only changes when ct.pointer works in the locking mode.
     * The initial value of the locked pointer is set to the last known position
     * of the unlocked primary pointer.
     * @catnipName locked pointer's x
     * @catnipName_Ru x захвач. указателя
     */
    var xlocked: number;
    /**
     * The current tracked position of a locked pointer in UI space.
     * Note that it only changes when ct.pointer works in the locking mode.
     * The initial value of the locked pointer is set to the last known position
     * of the unlocked primary pointer.
     * @catnipName locked pointer's y
     * @catnipName_Ru y захвач. указателя
     */
    var ylocked: number;
    /**
     * The current movement speed of a locked pointer relative to UI space.
     * Note that it only changes when ct.pointer works in the locking mode.
     * @catnipName locked pointer's x movement
     * @catnipName_Ru движение по x захвач. указателя
     */
    var xmovement: number;
    /**
     * The current movement speed of a locked pointer relative to UI space.
     * Note that it only changes when ct.pointer works in the locking mode.
     * @catnipName locked pointer's y movement
     * @catnipName_Ru движение по y захвач. указателя
     */
    var ymovement: number;
    /**
     * The current pressure made onto the primary pointer.
     * Note that this property is usually defined for special pointer types,
     * e.g. for graphic tablet's digital pens.
     * You will usually get 0.5 for mouse and touch events of regular devices.
     * @catnipName pointer's pressure
     * @catnipName_Ru нажим указателя
     */
    var pressure: number;
    /**
     * A number that, with a proper bitmask, tells which buttons are currently pressed.
     * Use ct.pointer.isButtonPressed(buttonName, ct.pointer.buttons) to check
     * for specific buttons.
     * @catnipName pressed buttons
     * @catnipName_Ru нажатые кнопки
     */
    var buttons: number;
    /**
     * The plane angle (in degrees, in the range of -90 to 90)
     * between the Y–Z plane and the plane containing both the pointer
     * (e.g. pen stylus) axis and the Y axis.
     * @catnipName pointer's x tilt
     * @catnipName_Ru наклон указателя по x
     */
    var tiltX: number;
    /**
     * the plane angle (in degrees, in the range of -90 to 90)
     * between the X–Z plane and the plane containing both the pointer
     * (e.g. pen stylus) axis and the X axis.
     * @catnipName pointer's y tilt
     * @catnipName_Ru наклон указателя по y
     */
    var tiltY: number;
    /**
     * The clockwise rotation of the pointer (e.g. pen stylus) around its major axis in degrees,
     * with a value in the range 0 to 359.
     * @catnipName pointer's twist
     * @catnipName_Ru поворот указателя
     */
    var twist: number;
    /**
     * The size of the primary pointer, in UI coordinates.
     * Depending on the type of the pointer, this property may not be available
     * and will be equal to 0 or something close to 1.
     * @catnipName pointer's width
     * @catnipName_Ru ширина указателя
     */
    var width: number;
    /**
     * The size of the primary pointer, in UI coordinates.
     * Depending on the type of the pointer, this property may not be available
     * and will be equal to 0 or something close to 1.
     * @catnipName pointer's height
     * @catnipName_Ru высота указателя
     */
    var height: number;
    /**
     * The type of the pointer used most recently (the one that was pressed).
     * It usually equals to either 'mouse', 'touch', or 'pen'.
     * @catnipName pointer's type
     * @catnipName_Ru тип указателя
     */
    var type: string;

    /**
     * Clears all the memorized pointer events (hovering events, pressed and released ones).
     * It can be used to reset the state of ct.pointer, but note that hover events
     * are reset as well meaning that pointers (like mouse) will report them only
     * when they become active again (for example, with a mouse click).
     *
     * @catnipName Clear pointers' events
     * @catnipName_Ru Очистить события указателей
     */
    function clear(): void;
    /**
     * Clears all the memorized pointer events that were released in the current frame.
     *
     * @catnipName Clear pointers' "released" event
     * @catnipName_Ru Очистить события отпущенных указателей
     */
    function clearReleased(): void;
    /**
     * Either returns the pointer that is currently colliding with the passed copy that exists
     * in gameplay coordinates, or returns `false` if there is no collision.
     * Collisions happen only if the pointer is currently held down.
     *
     * @catnipName pointer touches
     * @catnipName_Ru указатель касается
     */
    function collides(
        copy: Copy,
        pointer?: IPointer | undefined | false,
        checkReleased?: boolean
    ): false | IPointer;
    /**
     * Either returns the pointer that is currently colliding with the passed copy that exists
     * in UI coordinates, or returns `false` if there is no collision.
     * Collisions happen only if the pointer is currently held down.
     *
     * @catnipName pointer touches ui
     * @catnipName_Ru указатель касается ui
     */
    function collidesUi(
        copy: Copy,
        pointer?: IPointer | undefined | false,
        checkReleased?: boolean
    ): false | IPointer;
    /**
     * Either returns the pointer that is currently hovering over the passed copy that exists
     * in gameplay coordinates, or returns `false` if there is no such pointers.
     *
     * @catnipName pointer hovers
     * @catnipName_Ru указатель над
     */
    function hovers(copy: Copy, pointer?: IPointer): false | IPointer;
    /**
     * Either returns the pointer that is currently hovering over the passed copy that exists
     * in UI coordinates, or returns `false` if there is no such pointers.
     *
     * @catnipName pointer hovers ui
     * @catnipName_Ru указатель над ui
     */
    function hoversUi(copy: Copy, pointer?: IPointer): false | IPointer;
    /**
     * @catnipName is pointer's button pressed
     * @catnipName_Ru кнопка указателя нажата
     */
    function isButtonPressed(button: PointerButtonName, pointer: IPointer): boolean;
    /**
     * @catnipName Lock the pointer
     * @catnipName_Ru Заблокировать указатель
     */
    function lock(): void;
    /**
     * @catnipName Unlock the pointer
     * @catnipName_Ru Разблокировать указатель
     */
    function unlock(): void;
    /**
     * Equals to `true` when the pointer is locked.
     * Note that the pointer can still be unlocked while the locking mode is on,
     * for example after a player pressed ESC key or switched to a different window.
     *
     * @catnipName is pointer locked
     * @catnipName_Ru указатель заблокирован
     */
    var locked: boolean;
}

## v5.2.1

*Mon Nov 04 2024*

### ⚡️ General Improvements

* Catnip: Add mutators to timer blocks
* Catnip: Add mutators for "action is down/pressed/released" blocks
* Ct.js now checks whether recovery file actually differs from the regular project file
* Room editor: you can now navigate around with Spacebar + Left mouse button (Closes #526)
* :globe_with_meridians: Catnip: Improve Russian translations for ct.place
* :globe_with_meridians: Catnip: Translate Pointer catmod to Russian and add more human-readable English names
* :globe_with_meridians: Catnip: Translate the Random catmod's blocks to Russian

### 🐛 Bug Fixes

* Catnip: Add missing translation keys to Math operators
* Catnip: Fix catnip blocks ignoring translations when there was a translated name without a translated label
* Catnip: Fix inability to compile Script assets with Catnip code
* Catnip: Properly mark the required arguments in the Logic category
* Fields with invalid values should be outlined red
* Fix ct.js saving projects' scripts with CRLF sequence instead of LF, which caused them to be one-lined in the .ict file, making merging changes harder for Git users. You can fix the existing scripts by cutting and pasting their contents back.
* Fix minor styling issues on the homepage
* Fix `random.dice` trying to convert string values to floats (Closes #544)
* Make sure there are no special characters in the project name when creating one (Closes #543)

### 📝 Docs

* :bug: Fix brainless translation with room.append in Russian version of the JettyCat tutorial (Closes #141)

## v5.2.0

*Sun Oct 13 2024*

### ✨ New Features

* Add methods `u.distance`, `u.direction` (For Catnip, these can be found in Utilities category)
* Object list panel for room editor's select mode, plus hover effect on copies and tiles

### ⚡️ General Improvements

* Add a menu in the app's settings to change app's UI font to Open Dyslexic or Comic Relief
* Catnip: Add "set visibility" block
* Catnip: improve block names for the Place catmod
* Create missing properties and variables when copying Catnip blocks from one asset to another (and in other similar cases)
* Improve how backgrounds and scrolling textures wrap themselves. Closes #535
* Limit the amount of names the confirmation dialog shows when deleting several assets in the asset-browser tag.
* :globe_with_meridians: Update Chinese Simplified translation (#534 and #536 by @emaoshushu)
* :globe_with_meridians: Update Brazilian Portuguese translation (made by Henrique aka hlbarone on Discord)

### 🐛 Bug Fixes

* Catnip: Fix walkOverScript ignoring values in commands' arguments
* Catnip: Hide templates.killRecursive block as it is an internal API
* Fix an extra copy/tile appearing while using a rectangular fill in room editor
* Fix not being able to copy multiple blocks in catnip
* Fix overflowing content exceeding window boundaries in alertify modals. Closes #537
* Fix repeated import of same-named images (or the same image) leading to textures with identical names, which broke exports
* Fix rooms' tile editor not accepting 0 as tile layer depth
* Fix sprited counters not rendering in room editor
* Fix tabs with room editor not opening again if this room editor has an event editor open
* Fix values in room editor's entities properties panel not updating when selecting new copies or tiles
* Fix wrong initial values for rooms' camera restriction boundaries

### 🌐 Website

* :zap: New layout for engine's features
* :bug: Fix issues with package icon and rounded corners on main page's grid layour
* :fire: Remove old translation keys for the homepage
* :zap: :globe_with_meridians: Update wording in the homepage's introductory text for Russian locale
* :zap: Display games from static APIs in the homepage
* :zap: Improve illustration position on various screens

## v5.1.0

*Sat Jul 20 2024*

### ✨ New Features

* Enumeration asset type to create lists of predefined values for content types, behaviors, and to be used directly in code
* Global asset search accessible with the 🔍 icon in the top-right and the Ctrl+P hotkey
* Map data type in content types and behaviors' fields
* New `random.enumValue` method
* Paste textures with Ctrl+V while on the Assets tab
* Pixel-perfect mode for Scrolling Texture base class
* Place filled rectangles of copies or tiles with Shift+Ctrl modifier in a room editor
* Room editor: show a counter when placing copies or tiles in a straight line (with a Shift key)

### ⚡️ General Improvements

* Allow closing most success/error/warning messages in the bottom-right corner with a click
* Catnip: Add xprev, yprev blocks to the Movement category
* Disable Vulkan support by default due to frequent issues with it on Linux
* Ignore actions on not-yet loaded sounds; improve migration from v3 to v5 (#532 by @godmar)
  - sound actions on sounds that haven't been loaded are now ignored
  - sound.playing returns false for sounds not yet loaded instead of crashing
  - strip ct from ct.tween during migration
  - delete deprecated mouse catmod on 4.0.1 migration to prevent crash
* Internal: Improve how ct.js exposes base classes and Room to code editors
* Navigate through catnip in-place block search with arrow keys
* Remember last used tileset in an edited room
* Tweak styles of menus a bit so they don't change the height of a menu item when hovered
* Use fixed port number for in-editor docs and debugger so that localStorage doesn't vanish on ct.js restart. Also fixes memory leak with lingering web servers after closing a project.
* Use UI theme colors in room editor's tile picker
* Widen the asset confirmation dialog a bit
* :globe_with_meridians: Update debug and comments translation files
* :globe_with_meridians: Update Russian translation files
* :globe_with_meridians: Update Turkish translation file (by @Sarpmanon)

### 🐛 Bug Fixes

* :bento: Fix sound recorder by replacing microm package with @tscole/mic-recorder-to-mp3
* Add missing translation keys for actions
* Fetch patrons list on devSetup so there're no cache errors while developing locally
* Fix backgrounds blocking click events on copies and tiles
* Fix ct.transition causing an infinite recursion of room removal in its transitions
* Fix Ctrl+G hotkey in the room editor
* Fix mutators making broken blocks if a new `blocks` piece was introduced in a target block. Fixes errors with If-Else blocks that were mutated from If blocks
* Fix nested copies not being removed from appended/prepended rooms when a user calls `rooms.remove` on them.
* Fix not being able to port v3 versions to v5 (fixes incorrect sound conversion)
* Fix UI rooms positioned in reverse coordinate system when using this.x, this.y instead of this.position.x, this.position.y
* Importing a texture from a Buffer must prompt a user for a texture name

### 🌐 Website

* :bento: Resolve some npm audit warnings
* :bug: Fix misaligned icons in the navbar
* :zap: Add a Github link to the navbar
* :zap: Add a warning about shitty antiviruses and put a GH issue link for users to report about these cases
* :zap: Automate the changelog page by fetching the release notes from Github
* :zap: Support github issues and users mentions in markdown (for the changelog page)
* :zap: Update Japanese translation (by @taxi13245)
  - Clarified ambiguous expressions.
  - Added translations.

## v5.0.1

*Sat Jun 15 2024*

* 🐛 Fix not being able to change modifiers of inputs.

## v5.0.0

*Sat Jun 15 2024*

### ✨ New Features

* Add a custom error display in games so players can more easily report failures. Add a toggle to disable error reporting in-game and a field to specify a custom repor link.
* Add a method `tween.value` to the `tween` catmod, and add a Catnip block to animate arbitrary computed values.
* Add an option to main menu to autoapply asset changes before launching a game
* Add community's learning resources and games to the starting screen
* Allow using bitmap labels in buttons and textboxes, and introduce a new base class for Bitmap Text labels. Add an option to increase bitmap font rendering that fixes issues with bitmap fonts
* Behaviors: add Behavior added and Behavior removed events
* Context menu item for styles to create a template with a Text base class from it
* Customize debugger's layout: split-screen, multi-windowed, and automatic (based on the screen count)
* New programming language: Catnip
* New UI themes:
  * Alma Sakura
  * Golden Eye
  * One Dark Pro
  * Synthwave '84
* `room.makeCopyAligned` and `room.makeCopyAlignedRef` methods to dynamically add copies that align to camera's boundaries, in the same way you set up them in room editor's UI tools.
* Specify additional typedefs for JS properties of behaviors, templates, and rooms. Available for JavaScript projects only.

### ⚡️ General Improvements

* :bento: Update the `light` catmod for ct.js v5
* Add `'neutralino'` case to `u.getEnvironment` (Closes #517)
* Add additional checks for extended fields and fields in asset types. Fixes not being able to use array fields for asset types in content schemas
* Align table cells to the top
* Improve layout of project scripts
* Improve performance of afterDraw injection of matter.js catmod
* Internal: `'always strict'` on ct.IDE's compiled TS files
* Internal: Enforce stricter type checks in ct.js client library
* Internal: Bundle most node_modules and ct.IDE's scripts into one file. This makes loading ct.IDE faster, as well as reduces the bundle size and install time. It also drops `--mixed-context` nw.js flag.
* Internal: Update `nw-builder` to v4.7.4
* Limit max project name length
* Relayout the debugger screen to open the console in another window. Solves issues with JS breakpoints and "stop on exception" button
* Remember opened assets when a project is saved, and reopen them when a project is loaded
* Rename "editor" to "engine" in the ct.js' devtools banner
* Replace `resedit-cli` with `resedit` for ct.IDE: removes dependency for node.js in desktop exporter.
* Rework ct.js games' CSS to be less invasive to 3rd-party widgets and such
* Rework font asset type into typefaces
* Update patrons screen and move its logic into a module
* Update QR code generator for game debugger

### 🐛 Bug Fixes

* Add a safeguard to `tween.add` to not update values if the animated object was `kill`ed.
* Add proper handling of missing event declaration. Warn user about events that use missing catmods when exporting a project and in a template editro
* Fix `updateWindowMenu` error appearing on non-MacOS devices
* Fix ancient settings for monaco editor that showed errors on ES5+ features
* Fix being able to get several context menus by right-clicking other stuff with an already opened menu
* Fix being able to select game canvas on iOS browsers
* Fix built-in asset gallery not being accessible on Mac
* Fix canvases and code editors in tandem, style, room and scriptable editors disappearing after opening a tab -> switching to another one -> resizing window -> going back to the tab with a code editor or a pixi.js canvas.
* Fix cases when content types' typedefs were not updated
* Fix copy alignment being bound to copy-pasted copies in the room editor
* Fix copy rearrangement effects resetting upon reopening a room.
* Fix emitter's rectangular shapes being misaligned
* Fix error spam about uninicialized position and scale changes in `room-entities-properties`
* Fix monaco-editors hotkeys for changing font size
* Fix old current room name in `templates.copy` documentation
* Fix SnapTarget in room editor interfering with clicks on canvas
* Fix `templates.each` method. It can also be used with arrow function now, too, as it passes a copy to the first argument of your function.
* Fix textboxes' html inputs remaining on screen when a room changes
* Fix the `tween` catmods throwing errors despite using the `silent: true` option or `.catch` handlers
* Internal: Fix `gulp docs` failing on windows with new node.js versions
* Internal: Fix context-menu tags overwriting their `ref` attribute with "root"
* Internal: Fix devSetup.gulpfile.js failing on Node.js v20.13+ and Windows
* Internal: Rename properties of context-menu tag so it doesn't pull in global values
* Make monaco-editor pass Ctrl+S, F5 & Alt+F5 hotkeys to ct.IDE so you can save/launch projects while in a code editor
* Minor visual fixes for tabs
* Prevent dragging sound thumbnails in the sound editor

### 🍱 Demos, Dependencies and Stuff

* Gallery: Add textures for buttons and panels
* Add tutorial projects ported to Catnip by @firecakes
* Add a Catnip example of LabRaid
* Pull the latest docs
* Rename examples by tagging them with used language, remove two unsupported examples
* Update Comments and Debug translation files
* Update the list of boosters

### 📝 Docs

* :bug: Example code error (Follow a copy of a template called "Character") Fixes #133
* :bug: Grammar fixes on homepage
* :bug: Make the patrons list centered
* Add a patron list to README.md
* Add Catnip examples to ct.js tutorials
* Add Learn Catnip category
* 100% russian documentation translation
* Move a couple comments in catnip's declarationExtractor to a proper place

### 🌐 Website

* :bug: Fix the broken "games made with ct.js section", put a button to submit a game
* :bug: Set unique names for forms
* :construction: I may have summoned demons
* :globe_with_meridians: Add Chinese Simplified translation (#44 by @emaoshushu)
* :globe_with_meridians: Add Japanese translation (#45 by @taxi13245)
* :sparkles: Add forms for submitting games and learning resources
* :sparkles: Create an embeddable widget with supporters
* :zap: Add a honeypot for all the fields
* :zap: Add patrons panel to homepage
* :zap: Update wording on the homepage
* Add a nice language comparison thingie

### 👾 Misc

* :fire: Internal: Delete now unused `app/projects` folder from the repo
* :fire: Internal: Remove the `DragonBones` submodule
* :globe_with_meridians: Update Russian UI translation file

## v4.0.2
*Sun Feb 25 2024*

### ✨ New Features

* Add a menu item to duplicate emitter tandems. Closes #498
* Export and import emitter tandems from files
* Now you can change the background color in the style editor

### ⚡️ General Improvements

* :globe_with_meridians: Update Chinese Simplified translations (#500 by @emaoshushu)
* Behaviors will now have an additional icon in the asset viewer showing the asset type it was created for
* Do update checks at max once in an hour if it was successfully requested before
* Emitter editors will now show a (?) image instead of a blank broken image if no texture was set
* (Internal) Move properties assignment for AnimatedSprite from the Copy mixin into the pixi.js-based class.
* Now line height in style editors will scale with the font size when you change the latter
* (Internal) Refactor copy creation off base classes, move CopyAnimatedSprite, CopyText, CopyContainer prototypes into separate pixi.js-based classes.
* Remember whether the grid was disabled in a specific room
* Transparent background in style editor. Make the preview occupy the available space in the editor.

### 🐛 Bug Fixes

* Fix broken QWERTY and Shift+S hotkeys in room editors
* Fix buttons skipping their pointer events after being disabled and enabled back
* Fix discardio not removing old keys from asset object before assigning new ones, which led, for example, to not being able to disable stroke/fill/shadow settings of style assets
* Fix double caching of tile layers that breaks `rooms.merge` call. Closes #501
* Fix `fs` catmod failing when run in node.js context and trying to work with relative paths
* Fix hotkeys being ignored if non-english keyboard layout was in use
* Fix nine slice panes' tint being reset on click and not saved in the room-editor
* Fix not being able to deselect items after sorting *and* moving them
* Fix not being able to set tint with `this.tint` or the room editor to buttons.
* Fix scripts sometimes having blank screen when switching back and forth tabs
* Remove deleted behaviors from opened template editors, and deleted behaviors and templates links from rooms' properties panel
* Sound assets should prompt for a name when created

### 📝 Docs

* :bug: Fix movement by a grid (#132 by @0xFFAAF)

### 🌐 Website

* :zap: Update wording on essentials on the homepage

## v4.0.1

*Sun Feb 18 2024*

### ⚡️ General Improvements

* Changed button text from Save to Apply (#495 by @AnukratiMehta)
* Improve migration script for v4 to handle cases when assets had broken references to groups

### 🐛 Bug Fixes

* Fix migration code for v4 throwing an error if a project did not use fittoscreen catmod.
* Fix `pointer.collides` method
* Tabs of deleted assets must automatically close. Closes #491
* Update copies in room editors if their linked text style has changed. Closes #493

### 🍱 Demos, Dependencies and Stuff

* :zap: JettyCat's example project should use a text base class for its highscore label in the defeat screen
* 🐛 Fix fullscreen switcher in Catformer example(#490 by @sk757a)

### 📝 Docs

* :hankey: Use a vanilla document search
* Drop `ct.` prefix in catmod docs (#494 by @ehanahamed)

### 🌐 Website

* :bento: Update screenshots in the presskit
* :bug: Remove downloads for MacOS ARM builds that no longer exist
* :zap: Update text in the presskit
* :zap: Update the changelog

### 😱 Misc

* :globe_with_meridians: Update Debug and Comments translation files
* :globe_with_meridians: Update Russian UI translation file
* Fix supabase catmod (#497 by @ehanahamed)

## v4.0.0

*Sat Feb 10 2024*

### ✨ New Features

* Add a flag in main app menu -> Troubleshooting section to disable Vulkan support. This allows SteamDeck users to fix webgl issues with ease.
* Add a `random.text` method
* Add an option to disable caching of a tile layer
* Add context menu options in a room editor to sort copies and tiles by their X or Y coordinate
* Add context menu options in a room editor to send copies or tiles to back/to front
* App Blur and Focus events for rooms
* Asset confirmation popup when running a game without applying assets
* Asset folder tree with D&D support.
* Asset sorting by type.
* Base classes. A framework for adding new base classes templates are built upon and UIs for users to make templates that behave differently from regular animated sprites. Includes:
  * Ye old Animated Sprite.
  * Repeating texture and Sprited counter base classes.
  * Containers.
  * Nine-patch panels.
  * Buttons.
  * TextBoxes.
* Bindings for copies' properties in the room editor
* Branding options to switch "Made with ct.js" to the regular logo + to replace loading text
* Ct.js now adds hash sums of exported files' names to textures, icons, and your game's source code. It makes it easier to update your games on your own servers and prevents the usage of outdated assets for your players. Note that index.html file should never be cached — the other assets can now be cached.
* Ct.js will now backup your project's .ict file versions in addition to making recovery files. Amount of backups can be configured in main project's settings (old Authoring tab)
* Drop assets onto breadcrumbs.
* In the room editor, copies now show their templates' names when you hover them.
* Mass operations on assets in the asset browser
* Multiple asset dragging into folders
* New Behavior asset type
* New event "On app exit" for `desktop` catmod.
* New previewing engine (#441 by @markmehere). Co-authored by @CosmoMyzrailGorynych to adapt it for ct.js v4
* New Scripts assets and extended support for asset references in content editors and catmods
* New sound editor and sound engine (by @Atavismus with @CosmoMyzrailGorynych mentorship). Effects on API: `ct.sound` is now `sounds`, `ct.sound.spawn` is now `sounds.play`, 3D sounds are now in much higher quality and are run with `sounds.playAt` method. Effects on UI: it's dope.
* Now folders can be dragged around, too! Plus colored folder icons in the sidebar
* Optionally exportable project structure as `res.tree` and methods for browsing it.
* Set a fixed array length in array-editor and extensions-editor
* Support for TypeScript in custom scripts
* Typescript definitions for project's content types
* UI tools for the room editor

### ⚡️ General Improvements

* Emitter editor was updated to support pixi.js v7. Some features were added, removed, or transformed.
* "Duplicate" context menu options for templates, rooms, behaviors, and styles
* Add a 'disabled' binding to TextBoxes
* Add a filler for empty "Latest Projects" list
* Add a pointer polyfill catmod to support pointer catmod in Safari browser
* Add a prompt for new asset's name
* Add label to the notepad panel's show button
* Add methods to convert UI and game coordinates to coordinates in DOM space
* Add the "New Asset" button to asset browser's filler
* Add titles for longer settings items in the main app menu
* Add `u.time`, `u.timeUi`. Deprecate `u.delta`, `u.deltaUi`.
* Adds a transparent PIXI.js canvas option (#437 by @markmehere). Upgraded for pixi-v7 by CoMiGo
* Adds alpha setting for vkeys (#435 by @markmehere)
* Automatically open devtools in build environment
* Better compact layout for asset-browser
* Better handling of project scripts by keeping them as monaco models in memory. Solves errors about duplicate definitions and allows editing scripts by peeking into them from other code editors.
* Better tabs' widths on smaller screeens
* Bundle both PNG and WebP images on production. Let Pixi.js pick the supported format automatically.
* Capture pointer events in the pointer catmod so the listeners fire before Pixi's built-in pointer events
* Clamp zoom value in the room editor
* Convert textures to PNG on import
* Copies now have a proper hitarea for pointer events that matches the collision shape
* Display room events in a modal window. Children were confused and lost their rooms.
* Drop `ct.`, make all the namespaces global objects
* Exclude blank textures from export and retain shape (#433 by @markmehere)
* Improve line height in modal menus (e.g. event selection menu)
* Improve the visuals of launch confirmation window
* Make sure every copy has at least a basic collision shape
* Maximize window on start
* Minor style improvement for compact asset-browser
* New room previewer (#439 by @markmehere). Co-authored by @CosmoMyzrailGorynych for pixi v7 upgrade
* Pug files must use LF (internal)
* Remove extra padding in behavior lists
* Rename ct.random catmod into random
* Rename settings.speed to targetFPS
* Rename some i18n keys in non-english translation files
* Rename tween.add option useUiDelta to isUi to be in-line with ct.js API. Change `transition` catmod to use UI time for transitions
* Rework project creation form in a separate tab
* Riot mixins are now ESM modules in node_requires/riotMixins. languageJSON can now only be accessed through node_requires/i18n. (internal)
* Set icons and metadata for ct.js' Windows executables and sign them.
* Simplify the use of `wire` mixin for riot tags by removing the mandatory `this` in the beginning of the property path. (internal)
* Skip texture atlas packing if no changes to textures were made.
* Start copying sounds earlier in the exporter.
* Sticky headers for `.aNiceTable` CSS class. (UI)
* Support for base class capabilities in the exporter
* The exporter is definitely typed now (internal)
* Tighter layout of room editor -> room properties panel
* Update Dutch translation (#405 by @GambleBranch)
* Update Japanese translation (#404 by @taxi13245)
* Update the capture catmod for v4 (#477 by @Atavismus)
* Update the code for adding styled text labels in style-editor
* Update the `desktop` catmod for Neutralino.js
* Update the link for JDK download, so it shows exactly v17
* Update the skeletal-animation icon
* Updated `lib.es5.d.ts` (internal, #432 by @markmehere)
* Use a locally installed node.js for setting icons on Windows executables baked from project export for desktop. Propose users to download Node.js if it is not present in the system.
* Use simpler icons in array-editor, as icons overuse in content editors cause lagging

### 🐛 Bug Fixes

* Add the missing Promise typings
* Allow setting scale value with plain numbers, like `this.scale = 5`.
* Asset references should be updated in content types when deleted
* Fix "Cannot read properties of undefined" when caching tilemaps with funky positions, which led to rounding errors and negative indices.
* Fix a minor error in tween.add
* Fix a mostly harmless error in event-list-scriptable
* Fix an unbreaked case in emitter-editor switch statement
* Fix android builds. Fix capacitor-cli, it is now used from the bundled package
* Fix `any` type in imageUtils.ts (internal)
* Fix asset-selector, new-asset-prompt, exporter-error closing themselves when a click starts on one element and ends on another, mainly during text selection
* Fix broken hotkeys in the room editor
* Fix cached tilesets having terrible, terrible render in pixelart mode
* Fix copy system info menu, add a line about WebGPU
* Fix Ctrl + Shift + C hotkey for devtools
* Fix deleting tiles on a hidden tile layer
* Fix desktop exports
* Fix double retinization of drawing canvas that led to absurd canvas dimensions on mobile devices (and squishing of viewport)
* Fix event list not refreshing after a catmod was enabled/disabled
* Fix long-press events
* Fix memory leak with deleted tilemaps hanging in templates.list.TILEMAP
* Fix memory leak with undeleted backgrounds hanging in main copy stack and templates.list.BACKGROUND
* Fix missing field in tile layer when pasting in a room editor with no suitable tile layer
* Fix missing type definitions for `random.from`
* Fix nudging copies with arrows in a room editor resetting copies' positions after selecting anything else
* Fix `random.coord` method
* Fix sounds', tandems', and rooms' IDs not being unwrapped for the content system
* Fix templates.isCopy throwing errors when passed a constant value
* Fix textures not being properly removed from linked assets
* Fix the tiny black gap when a game is fully covering the screen
* Fix the Translate icon
* Fix `tween` catmod's typedefs
* Fix typo in translation (Ukranian -> Ukrainian) (#459 by @sk757a)
* Fix values in room editor tools reset when clicking on a different copy
* Fixed Android export issue (#444 by @omkarpattanaik)
* Ignore attempts to export mac builds on Windows
* In texture context menu -> Create template, create a template without asking for its name; prompt for a name if already occupied
* No texture must be `texture: -1` in exporter's templates output
* Projects' fonts must load into ct.js when opening a project
* Remove expandViewport view mode (not needed now, use "expand")
* Room.merge() must preserve scale, rotation, and alpha properties for copies (#457 by @winterstein)
* Update Discord invite links (#427 by @cemalgnlts)
* Update fs catmod to support Neutralino
* Use collision shape from a texture set in the extensions parameter of `templates.copy` method

### 🍱 Demos, Dependencies and Stuff

* Pull the latest asset packs
* Pull the latest docs
* Update examples and templates
* Update ESlint for typescript. Fix linter issues.
* Update nw.js to v0.72.0 (last to support windows 7)
* Update the list of boosters

### 📝 Docs

* Fix typo in example code (#108 by @GambleBranch)
* :bug: Change a single spelling error in docs/ct.md (#110 by @FlyingPig525)
* :bug: Fix a typo `created` in sound.howler's docs (#430 by @blueloveTH)
* :bug: Fix broken links on the homepage
* :bug: ru/README.md fix links (#106 by @progzone122)
* :sparkles: Add Giscus commenting service
* :zap: Update Vuepress and its theme
* 🐛 Fix links in fields-declaration
* 🐛 Fix links in input-methods
* 🐛 Fix links in settings-and-extensions
* 📝 Docs: Fix typo in docs/modding-ctjs/fields-declaration.md
* 📝 Fix old injects folder name in other languages
* 📝 Fix wrong injects folder name in events-and-injections.md
* 📝 Fix wrong/outdated injects folder name in mod-structure.md
* Update README.md
* Update the changelog

### 🌐 Website

* :bug: Fix links to Discord server
* :pencil: Update changelog
* :zap: A little refactor
* :zap: Add a line about "broken" files in MacOS to the download page
* :zap: Add a line about CoffeeScript into the presskit
* ⚡️ Add Dutch translation (#38 by @GambleBranch)
* :zap: Replace AppImage installer with an .sh one (for Linux platform)
* :zap: Update homepage and the changelog
* 📝 Fix wording for footer license info
* 📝 Fix wording for macDamangedWarning
* 📝 Fix wording on homepage

### ✌️ Misc

* :fire: Nuke app tour
* :fire: Nuke the old asset viewer
* :fire: Remove a non-existent method call
* :fire: Remove ancient ct.3d catmod
* :fire: Remove broken or deprecated catmods
* :fire: Remove ct.eqs, `PIXI.MultistyleText` (use `PIXI.HTMLText`), ct.ulid (use `nanoid`) catmods
* :fire: Remove discord-rpc, at least for now
* :fire: Remove `google-closure-compiler` (unused package)
* :fire: Remove old unused lines from i18n files
* :fire: Remove `pointer.permitDefault` and `keyboard.permitDefault` (use settings.preventDefault field)
* :fire: Remove remnants of old debugger versions
* :fire: Remove settings.width, settings.height, as they are not used anywhere and have no effect
* :fire: Remove the deprecated Room.addTileLayer method
* :fire: Remove the old debugger-toolbar
* :fire: Throw burst-mode of particle system into a dumpster, I'm quacking done
* :globe_with_meridian: Update Russian i18n file
* :globe_with_meridians: Update Brazilian Portuguese translation, by hlbarone at Discord
* :globe_with_meridians: Update Dutch translation (#485 by @GambleBranch)
* :globe_with_meridians: Update the debug translation file
* :globe_with_meridians: Update Turkish translation, by @Sarpmanon
* :hankey: Add a temporary band-aid for "t.isInteractive is not a function"
  See https://github.com/pixijs/pixijs/issues/9495 for root issue tracking
* :hankey: Add band-aids for @pixi/particle-emitter
  See https://github.com/pixijs/particle-emitter/issues/209
* 🐛 Replace this.depth with this.zIndex (#429 by @Piyush-Deshmukh)
* 📝 Fix type definitions for ct.backgrounds & gamepad module (#443 by @ehanahamed)
  * Update ct.backgrounds typedef
  * Update ct.backgrounds.list type
  * Added d.ts for gamepad catmod
* 📝 Update Discord Links
* 🧹 Annotate TODOs in code with issue numbers, remove obsolete TODOs


## v3.3.0

*Thu Dec 14 2023*

### ✨ New Features

* Ct.js now adds hash sums of exported files' names to textures, icons, and your game's source code. It makes it easier to update your games on your own servers and prevents the usage of outdated assets for your players. Note that index.html file should never be cached — the other assets can now be cached. Sounds are currently left with the old behavior as I have bigger plans for them and hashing large sound files is probably not the best idea. If you need to cache-invalidate a sound asset (say, by replacing one sound file with another), you can recreate the sound asset under the same name.
  Partially closes #409
* In the room editor, copies now show their templates' names when you hover them.
* Support for TypeScript in custom scripts
* Catmods: New Supabase Module (#425 by @ehanahamed)

### ⚡️ General Improvements

* Adds a transparent PIXI.js canvas option (#437 by @markmehere)
* Adds alpha setting for vkeys (#435 by @markmehere)
* Clamp zoom value in the room editor
  Closes #407
* Exclude blank textures from export and retain shape (#433 by @markmehere)
* Introduces ct.keyboard.permitDefault and ct.pointer.permitDefault (#434 by @markmehere)
* Pug files must use LF
* styleUtils to TypeScript and new IStyle interface (#440 by @markmehere)
* Update Dutch translation (#405 by @GambleBranch)
* Update Japanese translation (#404 by @taxi13245)
* Updated lib.es5.d.ts (#432 by @markmehere)

### 🐛 Bug Fixes

* Allow setting scale value with plain numbers, like `this.scale = 5`.
  Closes #403
* Allow textures to be set to -1 (#438)
* Fix "Cannot read properties of undefined" when caching tilemaps with funky posisions, which led to rounding errors and negative indices.
* Fix copies' custom properties in the room editor
* Fix shared asset pickers for sounds and emitter tandems
* Fix sounds', tandems', and rooms' IDs not being unwrapped for the content system
* Fixed Android export issue (#444 by @omkarpattanaik)
* Ignore attempts to export mac builds on Windows
* Update Discord invite links (#427 by @cemalgnlts)
* Use collision shape from a texture set in the extensions parameter of ct.templates.copy method

### 🍱 Demos, Dependencies and Stuff

* Update docs. Fix links to tutorials on the onboarding screen

### 📝 Docs

*  📝Fix typo in example code (#108 by @GambleBranch)
* 🐛 Bring back the adequate search plugin that doesn't ignore code in headers
* 🐛 Change a single spelling error in docs/ct.md (#110 by @FlyingPig525)
* 🐛 Fix a typo `created` in sound.howler's docs (#430 by @blueloveTH)
* 🐛 Fix broken links on the homepage
* 🐛 ru/README.md fix links (#106 by @progzone122)
* ✨ Add Giscus commenting service
* ⚡️ Fix dependencies' versions
* ⚡️ Tweak search settings a bit
* ⚡️ Update Vuepress and its theme, add search back
* 🐛 Docs: Fix links in fields-declaration
* 🐛 Docs: Fix links in input-methods
* 🐛 Docs: Fix links in settings-and-extensions
* 📝 Docs: Fix typo in docs/modding-ctjs/fields-declaration.md
* 📝 Fix old injects folder name in other languages
* 📝 Fix wrong injects folder name in events-and-injections.md
* 📝 Fix wrong/outdated injects folder name in mod-structure.md
* 📝 Add a comment to project-selector

### 🌐 Website

* 🐛 Fix links to Discord server
* ⚡️ A little refactor
* ⚡️ Add a line about "broken" files in MacOS to the download page
* ⚡️ Add a line about CoffeeScript into the presskit
* ⚡️ Replace AppImage installer with an .sh one (for Linux platform)
* ⚡️ Update homepage and the changelog

### 🌻 Misc

* 📝 Fix type definitions for ct.backgrounds & gamepad module (#443 by @ehanahamed)
  * Update ct.backgrounds typedef
  * Update ct.backgrounds.list type
  * Added d.ts for gamepad catmod

## v3.2.0

*Mon Dec 26 2022*

### ✨ New Features

* Add a small button to collapse template's properties panel. Useful for presentations.
* Add an option to room settings to automatically follow a copy of a given template
* Catmod for integration with Game Distribution, an ad service (#394 by @UlisesFreitas)
* Support for CoffeeScript! Choose your preferred language when creating a new project 💪

### ⚡️ General Improvements

* 🌐 Update Turkish translation, made by Sarpmanon from our Discord server!
* Add aliases `this.moveSmart` and `this.moveBullet` for `this.moveContinuousByAxes` and `this.moveContinuous` correspondingly (these come from the ct.place module)
* Add documentation links to the content editor's panels
* Add hotkey hints to undo/redo buttons in the room editor
* Do not show table headers for copies' custom properties when no properties exist
* Force background on the notepad panel's "expand" button; useful on dark themes with which it can blend with backgrounds
* Make addresses in the QR code panel selectable (debugger's toolbar)
* Prevent nw.js SDK menu from popping up when ct.js is packaged
* Relayout code editors when switching tabs. Prevents code editors from disappearing after zooming or switching template coding layouts
* Rework texture editor's layout
* Show theme colors in the app settings -> theme menu
* Update textbox tutorial for v3 and add the missing step (#396 by @firecakes)
* Warn users that they need to add a tile layer when they try to add tiles into a room that doesn't have any layers

### 🐛 Bug Fixes

* 🍱 Update 2DPhysics example
* Don't attempt to focus items in a context menus if there are no such
* Fix an ugly splash screen for the DungeonCrawler demo project
* Fix broken sound recorder
* Fix scrollbars sometimes appearing in the room editor
* Fix templates not being properly cleaned up if they are in a currently opened room
* Fix texture offset being applied to the texture preview window
* Fix wrong click location on a tile picker
* Ignore clicks on the "Run" button if a project is already being compiled.
  Should remove most of the headache with Window's EPERM issues
* Initialize timers for rooms
* Outline currently selected template in the room editor's template browser
* Room's background color input must not have an alpha input
* Set default values for room's camera restrictions
* Update respective asset viewers when they are changed or created. Fixes outdated template list in the room editor when you've created or modified a template while a room editor is open.

### 🍱 Demos, Dependencies and Stuff

* Update bundled assets
* Pull the latest gallery assets

### 📝 Docs

* 🐛 Multiply horizontal x-change with delta when robot travels on platform (#102 by @godmar)
* ✨ Translate jsintro_pt1.md to Russian (#100 by @progzone122)
* ⚡️ Create ru/jsintro_pt2.md and fix ru/readme.md (#101 by @progzone122)

### 🌐 Website

* 📝 Update changelog
* ⚡️ Add a big Discord badge to the downloads page
* ⚡️ Add a button for ARM builds for mac


## v3.1.0

*Mon Nov 07 2022*

### ✨ New Features

* Adds TypeScript support (#369 by @markmehere)
* Allow multiple projects open at once (#378 by @markmehere)
* `ct.res.groups` and `group` field in rooms and templates.
* Support for Apple Silicon builds (#368 by @markmehere)

### ⚡️ General Improvements

* Add context menu to the room editor to delete, copy, and paste items
* Better French translations (#371 by @rtauziac aka Crazyrems)
* Clean up gulpfile from unneeded packages and remove builds after zipping them
* Complete patrons tab, add a little shoutout to the starting screen
* `ct.capture`: add `portion` method (by Tho_mas), fix `object` method
* Define types for all the keys of IProject
* Do not minify HTML/CSS if not minifying JavaScript (#364 by @markmehere)
* Lossless image optimization for ct.js assets (#374 by @FlipFloop)
* Notepad now accepts free text (#376 by @markmehere)
* Tabbable copies and improved keyboard support in the room editor (#372 by @markmehere)
* Tooltip and alt-click for palette color removal (#375 by @markmehere)
* :globe_with_meridians: Add Turkish translation by Sarpmanon from our Discord server!
* :globe_with_meridians: Update Dutch translation, by GambleBranch
* :globe_with_meridians: Update Brazilian Portuguese translation (#384 by @leedigital)
* :globe_with_meridians: Update Chinese Simplified translations (#385 by @emaoshushu)
* :globe_with_meridians: Better French translation (#393 by @FlipFloop)
* :globe_with_meridians: Update Russian translation

### 🐛 Bug Fixes

* Add a missing name field to IStyle interface
* Apply changes in the properties panel when saving a room
* Delete typings on reset all (#373 by @markmehere)
* Examples on Mac should be clonable only (can't save inside the app itself)
* Fix a dumb typo in project-selector tag
* Fix a tiny typo at russian description of Frame End event
* Fix broken Pointer Enter, Pointer Leave events
* Fix custom property cloning link issue (#388 by @firecakes)
* Fix issues with timer events in the Catsteroids example
* Fixed bug of not showing texture and sound gallery when ctjs is run outside of your home directory (#386 by @leedigital)
* Names of content types should be marked as required
* Remove Wheel Scroll event — it was never supported by pixi.js v5.3.9. Use Actions and ct.pointer inputs instead.

### 📝 Docs

* :bento: Update vuepress to v2-beta-51
* :bug: Fix English headers in informative blocks on Russian locale
* :zap: Update several Russian pages

### 🌐 Website

* :pencil: Update changelog for v3.0.1

### 🌻 Misc

* :arrow_up: Upgrade to Monaco 0.34 (#377 by @markmehere)

## v3.0.1

*Mon Sep 12 2022*

### ⚡️ General Improvements

* :globe_with_meridians: Update French translation (#366 by @rtauziac)
* :globe_with_meridians: Update Japanese translation (#367 by @taxi13245)
* Drop precision on position and scale of objects in the room editor. Reasonably rounds their values to more logical numbers.

### 🐛 Bug Fixes

* Add support for template and texture arrays to the Context subsystem
* Escape single quotes while stringifying certain properties. This allows, among other things, use of ' in custom properties (room editor) and template names
* Fix `ct.place` crashing game if a collision check is made on a disproportionately squished circle
* Room editor shortcuts must work only if the Rooms tab is active

### 🍱 Demos, Dependencies and Stuff

* Update nw.js to v0.67.1

### 📝 Docs

* :zap: Fix old terminology in skeletal-animation.md (by @omartek)
* Italian translation for the working-with-editor section (by @omartek)

### 🌐 Website

* :bug: Fix img tag appearing in games' descriptions on the Made With page
* :bug: Remove .DS_Store
* :pencil: Update changelog
* :zap: Add a working version of web installer for windows
* :zap: Italian documentation translation is now public; add a proper link in the header!
* :zap: Temporarily replace web installer for windows with zip archives
* :zap: Update italian translation (@omartek)

### 🤖 Misc

* :fire: Remove now useless twoPi var in ct.place

## v3.0.0

*Fri Sep 09 2022*

### ✨ New Features

* Add a tour-guide tag for making tours in ct.IDE. Add an overview guide to the app-menu. Also simplifies the code of app-menu navigation a bit.
* Add `ct.rooms.restart()` method
* Events framework — more vanilla events and ability to add modded ones! Closes #215
* New rooms editor! Closes #39, #76, #269
* New & Updated Themes (Nord & Rosé Pine) (#344 by @EhanAhamed)
* Pride mode with a colorful navigation
* Support for blank textures (#362 by @markmehere)
* :bento: Add a vgui catmod by Firecakes (Textbox component)
* :bento: Desktop features Catmod: New Features & Rewrite of Previous Features (#354 by @EhanAhamed)

### ⚡️ General Improvements

* :globe_with_meridians: Update Russian translation
* :globe_with_meridians: Update Dutch translation, translated by GambleBranch from Discord server!
* :globe_with_meridians: Update Debug translation
* :globe_with_meridians: Ukrainian translation by @progzone122
* :bento: Update `ct.matter`; you can now design gameplay logic with events in the template editor. Also brings an update to the 2DPhysics example
* Add Boosty link to the starting screen; change "Donate" url to boosty page
* Add explanations to ct.js license in the license panel (with suggestions by Shiba). Closes #345
* Add sanity checks for the texture editor. Closes #361
* Backgrounds' parallax effect now behaves more natural when zooming in/out
* Re-capture window focus on game's mouseover in ct.pointer
* Remove event listeners on ct.fittoscreen.toggleFullscreen. It is now supposed to be run in new pointer events
* Replace gulp-typescript with @ct.js/gulp-typescript. Allows building ct.js on Node.js v18+
* Simplify memocats by using built-in pointer event (#360 with @omartek)
* Support for Meta key for Mac as an alternative to Control key during room editor's deleteX interactions
* Visually dim deprecated catmods

### 🐛 Bug Fixes

* :globe_with_meridians: Fix Russian "export for web" translation
* Big texture support, above 2k by 2k (#358 by @markmehere)
* Change the "Create a template from it" for skeletal animations so it actually works
* `ct.res` must wait for skeletal animations to finish loading before starting the game
* Fix array editors writing nothing when working with assets
* Fix broken license panel
* Fix `ct.delta` behaving incorrectly if `ct.speed` is changed (It is actually a band-aid over pixi.js' issue, buuut oh well)
* Fix `ct.emitter.follow` rotating around a copy at a wrong angle
* Fix `ct.inherit`'s regression from v1. Closes #337
* Fix `ct.light` using changed `ct.templates.exists` inappropriately
* Fix event list being shared on newly created templates
* Fix examples and templates not showing when ctjs is run outside of your home directory (#357 by @leedigital)
* Fix freshly-created textures crashing the room editor
* Fix inability to select a preview texture in emitter tandem editor
* Fix node context missing in ct.js debugger. Makes Node.js and ct.fs work again.
* Fix unusable modal window on Linux systems during project creation (#351 by @leedigital)
* Fix the alert about improper web build usage that was popping up in Electron builds
* Remove a reference to a non-existent sourcemap from ct.filters denendency
* Tiny visual fix for collapsible input groups in the template editor
* Truncate long names in resource cards. Closes #353
* Update Comigo (what?)
* Update coordinates of primary pointer in gameplay coordinates if a user doesn't move the pointer
* `ct.matter`: fix physics breaking when additional rooms are appended to the current one

### 🍱 Demos, Dependencies and Stuff

* Update Space Shooter example project
* Pull the latest docs
* Update 2DPhysics example with a restart button and ct.pointer in place of ct.mouse
* Update asset gallery contents
* Update Catformer example
* Update various demos and templates
* Update JettyCat example
* Update memocats example
* Update Platformer example

### 📝 Docs

* :clap: Pt-BR documentation translation (100% translated!) (#75 by @leedigital)
* :bug: Fix "Propose edits" link
* :bug: Fix pre-v1 direction value at the JettyCat tutorial
* :bug: JettyCat fixes (#81 by @omartek)
* :zap: Minor edits and fixes for localStorage page. Add a missing comma and a couple of comments
* Content Subsystem Docs: Fixed Grammar Errors
* Corrected Grammar in Basic Concepts Docs
* Fixed Incorrect Grammar ct.inputs Documentation
* Room Class Docs: Fixed Minor Grammar Errors
* Updated ct.styles Documentation

### 🌐 Website

* :clap: Italian site translation (#27 by @omartek)
* :zap: Add a link to ct.js cheat-sheet to the "what's next" section, put a little heart in place of the list counter to the patreon section
* :zap: Add a link to web installer for Linux
* :zap: Replace patreon links with boosty ._.
* :zap: Update Downloads page. Add a Windows web installer

### 🌻 Misc

* :fire: Remove property `thumbnail` from the rooms objects in project data
* :hankey: Fix `npm ci` problems


## v2.0.2

*Sun Apr 17 2022*

### ✨ New Features

* Internal: Add two utility classes to change cursor on specific elements

### ⚡️ General Improvements

* Add an explicit close button to the asset-selector, if there is a cancel action defined to it. Also adds an example of a "close" button pattern inside a dimmer to the CSS stylebook
* Add basic typings to Window object and to the global scope (setTimeout and co, atob, btoa and such)
* Add support for ct.pointer to ct.vkeys
* Do not show "there is nothing here" filler if an asset viewer has to display a "none" option
* Move particles' node modules to the same folder as tandems'; enforce type checks on default emitters and tandems; add the missing uid property to emitter tandems.
* Tweak UI animations' duration; add subtle animations to most modal dialogues
* Update Chinese Simplified translations (#335 by @emaoshushu)
* Update Turkish translation. 100% coverage thanks to Sarpmanon.js!

### 🐛 Bug Fixes

* 🍱 Fix music stopping on the third level of the Lab Raid demo. Thanks mugeen for finding the issue and its source.
* Changing speed of a copy from zero should reuse its saved direction (zeroDirectionAccessor). Closes #334
* Fix asset inputs' styles affecting button groups deeper into its tree
* Fix broken project-aware code completions
* Fix ct.place.moveAlong (which is also this.moveContinuous for copies) using v1 directions values and not handling the latest bit of the path properly
* Fix ct.pointer not writing pointer.PrimaryKey, pointer.SecondaryKey to the Actions system
* Fix the asset selector applying styles to more than it should have. Fixes the group editor inside asset selection models being large as heck.
* Fix the asset-selector incorrectly capturing clicks on its modal's background
* Fix the usage of non-existent ct.place methods in ct.pointer

### 🌐 Website

* :zap: Update list of features in the presskit

## v2.0.1

*Sat Mar 26 2022*

### ⚡️ General Improvements

* Internal: automate publishing to Github assets with Gulp and Gitlab CI

### 🐛 Bug Fixes

* Fix the missing asset gallery's assets

## v2.0.0

*Sat Mar 26 2022*

### ✨ New Features

#### Major features

* Action presets
  * Export and import Action presets as JSON files
* Add a built-in asset gallery of CC0/WTFPL assets
* Add a Ghost color scheme
* Appearance section in the type editor that groups ol' Depth and Visible fields with a shiny new Blend Mode selector, Opacity input, and a checkbox for playing the sprite animation automatically
* Array fields for modded controls and the content editor
* Built-in sound recorder
* Content type editor for making customized tables for structural data. Also introduces icon-selector and icon-input tags.
* ct.pointer module. Closes #314
* Export to Android with Capacitor framework :tada:
* i18n support for modded fields
* ✨Nord Theme for ct.js (#301 by @SaberTooth-Studios)
  Created Nord UI & Monaco Editor Theme for ct.js, using the NordTheme (nordtheme.com) color pallete, an arctic north-bluish color palette with beautiful and harmonic color contrasts.
* Project templates functionality; debuting with a platformer template!
* Revamp of the asset viewer: it now supports grouping your assets with categories, as well as displays handy information in forms of small icons. Besides that, every tab now supports three display modes: list/table view, regular cards, and large grid of cards.

#### Minor or mostly internal additions

* Add a stylebook for CSS classes, found in the Meta panel of the main menu. Also removes some discovered dead classes.   Partially solves #317
* Add dividers to extension editors' select boxes
* Add small buttons to the texture editor to copy collision masks from one texture to another
* ct.u.numberedString, ct.u.getStringNumber methods
* Internal: expose theme's colors with theme manager's getSwatches method
* Internal: the reusable collapsible-section now supports adding a custom header with a special yield slot
* New forms and fillers for the texture generator

### ⚡️ General Improvements

* Actions' input method selector now searches by module's name, too
* Add a .monospace CSS class
* Add a wide variant of aButtonGroup to CSS. Add support for wide asset-inputs
* Add a workaround for Windows' issues with music files and their locking
* Add an additional language selector to the starting screen
* Add an alert message to ct.js' main.js file to warn users/developers when they try to run a web build as a web page.
* Add Japanese UI translation by karintou21
* Add Russian translation to a good portion of catmods
* Better display of modules' documentation
* Change action presets to use ct.pointer instead of deprecated ct.mouse and ct.touch
* Change exit button text for all editors to "Apply", except for the rooms' event editor. (#309 by @QuickBanjo)
* Change how compact extended asset fields are defined. Improves the UI of the content editor
* Create a universal asset picker. Closes #316
* Ct.js' copies now remember direction if their speed is 0
* Generate shorter GUIDs for everything with NanoID
* Icons for room editor's context menus
* Improvements to `this.tex` property: If you set the texture to the same one, the change will be ignored. If you do change the texture and the previous animation was playing, the new one will play automatically as wel.
* Layout improvements for the texture editor
* Make ct.templates.valid a TypeScript type guard
* Make i18n keys follow camelCase, also fix a few vague names here and there
* Mark ct.mouse and ct.touch for deprecation. Use ct.pointer instead.
* Minor edits to i18n linter
* Minor UI tweaks of the room editor
* Modals' buttons now have some spacing between them when they stack vertically
* Optionally show frame indices in the texture editor
* Remove dead unused properties from the ct object
* Rename ct.place's ctype into cgroup
* Rename injects to injections. Injects were just bad English.
* Rename types into templates
* Reorder src/tags/project-settings folder
* Replace "coin" icons to "texture" icons in emitter tandem editor, so it matches the icons used in UI to refer to textures
* Revert 100% on tables in the content-editor
* Simple macOS fixes including bumped nwVersion
* Sound editor now prevents Apply when name is taken. (#311 by @QuickBanjo)
* Texture inputs (which are used in the type editor and some places in the Project tab) now have a "Clear" button inside them.
* The `tag` catmod now supports arrays of tags
* UI improvements for the textures and FX panels
* UI: better readability for on-canvas labels and buttons, especially for dark color schemes
* UI: better readability for on-canvas labels and buttons, especially for dark color schemes
* UI: Quicken icons loading, removing lags on icon-heavy interfaces
* Use a custom Pixi ticker instead of a shared one. This magically heals FPS drops in platformers **(w h a t)**
* Widen the columns of the texture editor
* Write an icon list It seems it was lost while cherry-picking changes from develop.

#### Internal changes

* Add more methods & typings to resources/modules for a more uniform and accessible use elsewhere
* categorize JS scripts into several folders
* CI/CD: Partially migrate to Gitlab CI
* Consistent CSS class naming for building blocks
* develop branch: Fixed launch.json to work with nwjs extension. (#304 by @QuickBanjo)
* Fixed launch.json to work with nw.js extension (#303 by @QuickBanjo)
  Also committing autogenerated change to package.json
* rename modulesWithDocs to modulesWithFields inside project-settings, as the previous name did not reflect the contents of the actual collection
* Make a versions.js file that checks and returns used nw.js and pixi.js versions. versions.js should now be used as a source of truth about used nw.js and pixi versions. Closes #305
* Update ct.sprite for new ct.res API
* Update gulp-pug to v5
* Update node-notifier to v10.0.0
* Update pixi.js to version 5.3.11
* Update pug to v3
* Update Russian i18n file

### 🐛 Bug Fixes

* :pencil: Change "An utility that managess" to "A utility that manages" in ct.res comments (#294 by @Tiger-The-Cat )
* :pencil: Change "There are ariants" to "There are variants" in ct.touch docs (#300 by @Tiger-The-Cat)
* :pencil: Change two occurences of "ligth" to "light" in ct.light docs (#295 by @Tiger-The-Cat)
* :pencil: Fix spelling issues in the riot doc format
* Add missing typings for ct.mouse.hide, ct.mouse.show
* Add missing variables to UI themes
* Add the missing injection "beforeframe" to the exporter
* Ct.js now shows exit confirmation dialogues only when needed. The dialogue now also appears when you close the app with unsaved changes. Closes #302
* Fittoscreen should not try to change ct.camera if the game hasn't loaded yet. Closes #299
* Fix ct.place.enableTilemapCollisions' effect being cancelled if called in room's OnCreate event
* Fix invisible save dialogs covering interface. Closes #293
* Fix missing port number in debugger's QR-code generator
* Fix room editor behaving funky when their scaling values are zero.
* Fix room's properties panel hiding the "apply" button when there are lots of modded properties
* Fix several issues with insecure dependencies
* hover-hint tag should be vertically aligned
* Remove excess keys from the i18n files
* Remove icons.json that should've been gitignored
* Remove unused project prop "styletick" (#313 by @QuickBanjo)
* Set exported games' doctype to html
* The "Open Project" button in the main menu didn't actually listen to user's decision on whether or not they were sure they wanted to close the current project.
* Update the sidebar of the Project tab when a new content type was created
* Workaround for #276 (#281 by @Girgetto)

### 📝 Docs

* :sparkles: Introduction to JavaScript: part III. Arrays and Objects. Co-authored-by: firecakes <alberto19942@gmail.com>
* :sparkles: Add "Making your own sound module"
* :sparkles: Add docs for the content subsystem
* :sparkles: Add docs for the room editor
* :sparkles: Create a document section for building your game and deploying it online (#69 by @NicBritz)
* Add an example on spawning a bullet relative to a player in ct.u docs
* Add fields' "array" type to homepage's notable additions
* Add the `if` key to modded fields' docs
* Document new features of modded fields
* Document v2 changes in ct.u, ct.camera, ct.templates
* Write about changes in ct.place inside the migration guide
* Write initial set of notable changes on docs' homepage
* Move "Actions" page to the "Working with the editor" section
* Remove v1.x badges from "Fields reference for module settings and additional fields"
* Update docs for ct.res.
* Update docs for ct.u.rotateRad, ct.u.rotate, ct.u.uiToGameCoord, ct.u.gameToUiCoord and ct.camera's derived methods
* Update docs on this.angle, this.rotation
* Update dragging-copies.md. Removed merge conflict from example code
* Wording fixes, mainly tons of type -> template replacements
* :bug: Change "ct.transision" to "ct.transition" (#62 by @Tiger-The-Cat)
* :bug: Fix a broken warning plaque in the JettyCat tutorial
* :bento: Update VuePress

### 🌐 Website

* :bug: Change "StromCross" to "StormCross" (#21 by @Tiger-The-Cat)
* :pencil: Update changelog
* :zap: Better wording for What's next section
* :zap: On downloads page, replace the itch.io iframe with a link
* :zap: Reformat "what's next" section and add a Russian Discord server (shown on Russian locale only)
* Merge branch 'master' of github.com:ct-js/ct-js-site

### 🍱 Demos, Dependencies and Stuff

* :bug: Example bug fixes (#288 by @markmehere)
* :zap: Renovate catformer's code
* Add a bunch of app icons
* Add typings for font-related JS APIs
* Apply migration scripts ts to examples and templates, fix Yarn demo's TheGirl position
* Pull the latest docs
* Update examples
* Update nw.js to v0.59.0

## v1.7.0

*Sat Apr 10 2021*

### ✨ New Features

* Add custom properties modal for copies (#275 by @firecakes)
* Added map() function to ct.u (#274 by @qewer33)
* Clone projects from the starting screen

### ⚡️ General Improvements

* 🌐 Update Russian i18n file
* Add an optional "Made with ct.js" logo shown while a game is loading. Can be turned off in Project tab -> Branding section
* Add more social icons to the starting screen

### 🐛 Bug Fixes

* Fix `emitterTandem.pause()` stopping completely if called several times before calling `emitterTandem.resume()`
* Fix game's icon not being reset when its texture is deleted
* Fix page name and app color for exported games
* Fix targetX and targetY handling for cameras' boundary restrictions

### 🌐 Website

* :bug: Add the missing link to the German translation to the footer
* :zap: Add a link to Vkontakte to footer
* :zap: Update "What's next" block
* :zap: Update navigation bar

## v1.6.2

*Wed Mar 31 2021*

### ⚡️ General Improvements

* Add JS map files for pixi.js
* Update pixi.js to v5.3.8

### 🐛 Bug Fixes

* :bento: Fix 2DPhysics example

### 🐉 Misc

* Revert "Modify emitter tandems to use ParticleContainer"
  This reverts commit b8a47f4273fb08e8377c5489ef8e30464bf41845.

## v1.6.1

*Sun Mar 29 2021*

### 🐛 Bug Fixes

* Fix teleport, spin, rotate, and rotateBy methods in ct.matter module

## v1.6.0

*Sun Mar 28 2021*

### ✨ New Features

* Add `ct.filters` module by SN frrom our Discord server. The module allows creating special visual effects with filters or custom shaders, applied to your copies or a whole viewport
* Add `ct.light` module for adding ambient lighting and textured lights
* Add `ct.matter` module for 2D physics. See the new example!
* Bundle `ct.nakama` module by @alexandargyurov — you can now create online games with ct.js!
* Group modded fields into collapsible sections with a new field type
* Nano ID catmod of the same-named tiny library by Andrei Sitnik
* Optionally make a camera stay inside a specific rectangle with new rooms' settings.

### ⚡️ General Improvements

* :bento: Update Electron used in desktop builds to v11.1.1
* Allow Background class to accept a pixi.js texture
* Modify emitter tandems to use `PIXI.ParticleContainer`. Provides better performance, and also fixes issue with un-tintable emitters.
* Renovate `ct.desktop` -> quit method
* Select only the needed Nw.js version for debugging

### 🐛 Bug Fixes

* Allow resetting values in type and texture inputs at modded fields
* Fix "}" at the end of some texture files' names
* Fix bitmap font's XML ("kerings" typo")
* Fix broken context menu entry for textures to create a type from them
* Fix crashes of built-in debugger; disable nw and node in the devtools
* Fix `ct.place.meet` returning duplicated references to copies if querying for multiple obstacles
* Fix icons for nightly and regular releases
* Fix Point2D initialization for modded fields
* In rooms' copy spawning code, check for scaling extensions separately
* Remove the old main-menu tag

### 🍱 Demos, Dependencies and Stuff

* Update  nw.js to v0.51.1

### 📝 Docs

*  Add "Dragging Copies Around" tutorial by @qewer33
* :bug: Add missing methods `ct.types.isCopy`, `ct.u.hexToPixi`, `ct.u.pixiToHex`
* :bug: Add `moveTo` and `teleportTo` methods in `ct.camera` (#49 by @firecakes)
* :sparkles: Add a list of gamedev resources
* :zap: Add categories to ct.u methods list
* :zap: Minor edits for JS intro, pt. 1
* :zap: Refurbish the home page. Move most old content to "Basic concepts". Add links to tutorials and the cheatsheet.
* 🐛 remove duplicate instruction to draw `scoreLabel`.
* Add a memo about `ct.desktop.isNw` and `ct.desktop.isElectron`
* Fixed typos in the Space Shooter tutorial by @sarturodev

## v1.5.1

*Thu Dec 24 2020*

### ✨ New Features

* New tweening functions (elastic, bounce, and with backwards motion) for ct.tween by kkornushin
* Two UI themes Pooxel Green and Pooxel Blue for that retro feel 👾

### ⚡️ General Improvements

* Chinese Simplified 100% translated for branch v1.x (#246 & #248 by @emaoshushu)
* Use nw.js' nightly build 25eea59. Solves issue with restarting ct.js after running a game in it.

### 🐛 Bug Fixes

* Fix `exts` object missing on newly created copies.
* Fix formatting problem at ct.place docs > Tracing functions > ct.place.traceRect.
* Partially fix memory leaks in paricle emitter editors.

### 📝 Docs

* Use cgroup instead of ctype in ct.place typings and docs to remove ambiguity with ctypes and regular types
* :bug: Fix wrong function names at ct.noise


## v1.5.0

*Sun Nov 08 2020*

### ✨ New Features

* "Visible" checkbox at a type editor
* A toggle at room's settings to set a room as a UI layer
* Add `silent` option for ct.tween.add to suppress errors on non-vital animations
* Add a main menu entry to change data folder (Closes #238)
* Add basic Discord Rich Presence
* Add diamond-like partitioning for caching tile layers (`ct.tilemaps.cacheDiamond`)
* Add high-contrast black theme
* Add histogram, pessimistic and optimistic methods to `ct.random` catmod
* Add minify, obfuscate, and function wrap transforms for exports (#242 by @naturecodevoid)
* Add `storage` catmod
* Check for ct.js folder write permissions, and show a prompt when it is not writable
* `ct.backgrounds` API
* `ct.camera.contains` to check whether a copy (or another displayable object) is potentially visible on a screen
* `ct.noise` module for seeded Perlin and Simplex noise funcitons, useful for freeform procedural level generation.
* `ct.splashscreen` module (Closes #148)
* `ct.tilemaps` API
* `ct.types.isCopy(obj)` method to check whether a variable is a copy
* `ct.u.hexToPixi`, `ct.u.pixiToHex`
* F11 to toggle fullscreen
* Forest UI theme — an adaptation of https://github.com/sainnhe/forest-night-vscode by @sainnhe
* Jump to a texture from texture inputs
* Solid color fills and cross drawing at placeholder texture generator
* Specify multiple video formats at `ct.cutscene`
* Table inputs for modules — they allow users to create collections of complex objects with specified structure, readable in a module as an array
* Tracing methods for ct.place (Closes #232, #117)

### ⚡️ General Improvements

* Add preventive checks to `ct.sound.howler` to not throw errors if one tries to manipulate stopped/non-existent sound
* Add typings for `Room.uid` property
* Allow media access, pointerLock API, and download prompts for games inside the built-in debugger. Makes `ct.capture` work inside this debugger.
* Autocompletions for `ct.rooms.list`
* `Background.isUi` is now read-only and is calculated based on its parent's value. Fixes alignment issues for backgrounds that are added to UI layers.
* Controls for texture shape are working similarly to curve editors now: you can press in the middle of a line segment and drag out a new point, and delete points with right click
* `ct.res.getTexture('Name', null)` now returns the whole animation
* Foreign key unwrapping support for modules' settings and injections, plus recursive unwrapping for arrays
* Improve workflow for creating new theme, generalize theme-related code as a node-require module "themes".
* Put additional bleeding on transition's sides from `ct.transition` to mitigate rendering issues due to rounding
* Refurbish project selector and add Examples tab
* Refurbish the exporter
* Return copies in `ct.place.moveByAxes`. Fix issues with type definitions.
* Textures: Pressing Fill + To Center now produces the same result as To Center + Fill.
* Tweak typings for `ct.place`
* Vertical and horizontal lines in curve editors display more reliably

### 🐛 Bug Fixes

* Add a translation key to the english file, for Horizon theme
* At the room editor, fix eraser's size not falling back to some constant if a grid was disabled
* Don't show a context menu when right-clicking on curve points
* Fix a bug with replacement of `$'`, `$&` and other special RegExp tokens in injections and user-provided code
* Fix a memory leak that made the whole old IDE set not being freed on project change
* Fix a stupid issue with `ct.capture`
* Fix an issue about a timer not being destroyed if a game switched to a room with the same name (restarted a room).
* Fix broken `ct.camera` typings
* Fix `Camera.getBoundingBox`
* Fix horrible memory leak at `debugger-screen-embedded`
* Fix image transforms for thumbnails
* Fix issues with font loading if the project's full path contain spaces
* Fix issues with non-repeating UI backgrounds
* Fix subsequent `pause` calls on an emitter breaking this emitter entirely
* Fix `themeSpringSream` in Brazilian Protuguese translation file
* Fix typings for `ct.sound.follow`
* Fix usage of `viewWidth`/`viewHeight` in catmods
* Fix wrong default folder for the starting project selector
* Focused buttons should be highlighted
* I don't know what it was, but it is fixed
* Initialize `ct.mouse.x`, `ct.mouse.y`, and `ct.mouse.xui`, `ct.mouse.yui` with zero values.
* `SpringSream` -> `SpringStream` at i18n files
* Submenus should not disappear if their elements are focused by pressing Tab button
* Trim whitespace while creating new projects to avoid problems with build tools and sticky situations because of invisible symbols
* Type's name should change from default to texture name after texture selection
* Zero parallax value should be a valid one

### 🍱 Demos, Dependencies and Stuff

* Add a MoveBlocks example
* Add a DungeonCrawler example

### 📝 Docs

* :bug: Add missing part to platformer tutorial
* :bug: Explicitly note the removal of `this.move()` at platformer's robot character (Closes #33)
* :zap: Add gifs that explain how `ct.camera.realign(room)` works (Closes #21)
* :zap: Clarification for `ct.types.copy` (Closes #32)
* :zap: Rename properties at the platformer tutorial to standard names
* Format method names in `ct.place` docs. It looks better this way.

### 🌐 Website

* :zap: Update changelog

### 👽 Misc

* :fire: Remove ancient image files that are no longer used by ct.IDE


## v1.4.2

*Sat Aug 29 2020*

### ✨ New Features

* Add `tag` catmod, for adding tags for individual copies and rooms.
* Add a properties panel for tweaking parameters of an individual copy.
* Add `PIXI.MultiStyleText` module.
* Add support for moddable extensions for individual copies.
* Add texture generator for placeholders.
* Background color control for rooms (finally!)
* Code completions now suggest names of types, rooms, sounds, actions, and emitters.
* `ct.place.moveByAxes` and `this.moveContinuousByAxes` for easy movement at platformers and top-down games.
* `ct.place.moveAlong` now checks against tiles too
* Fast integer scaling mode for `ct.fittoscreen`, for purely pixelart projects.
* Hide default cursor at Project -> Render Options -> Hide system cursor
* Import a texture by pasting it from a clipboard. Will update an existing opened texture as well!
* In the room editor, Shift+Click now selects the nearest copy or tile.
* New `select` input type for catmods, as an alternative to `radio`
* Nightly builds at comigo.itch.io/ct-nightly.
* Seeded random for `ct.random` module
* `slider`, `sliderAndNumber` input types for extensions, and additional settings for them and `number` inputs.
* Sort copies or tiles inside a room with two new buttons at the top-left corner of the room editor. Extremely handy for isometric games!
* Toggle UI sounds in the Main menu -> Settings

### ⚡️ General Improvements

* A popup to quickly fix backgrounds at the room editor if their texture is not marked for tiled use.
* Add .itch.toml to simplify run dialog on Linux.
* Add `dnd-processor` tag that solves edge cases with drag-and-drop behavior and allows dropping any supported files on any tab.
* Add icons that highlight deprecated and preview modules more clearly.
* Better zooming controls for room, texture, and emitter editors.
* Change build, projects', export folders to be stored under the `~/ct.js/` directory.
* Change `ct.fs` to use app data directories for Linux, Windows, macOS (#226 by @JulianWebb).
* Decrease threshold that differentiated clicks and drags in room editor, improving placing behavior of multiple tiles/copies.
* Improve preview making process for textures.
* Improve tile positioning algorithm for the room editor.
* Minor UI improvements for the texture viewer.
* Position context menus so that they don't exceed viewport's size.
* Rename "Author" field at settings into "Developer" (i18n strings only).
* Scale smaller tilesets to fit the tile picker, at the room editor.
* Update Russian UI translation.

### 🐛 Bug Fixes

* A workaround for 'oncancel' not being fired on `input(type="file")` tags. Fixes an issue with invisible inputs overlaying the main menu.
* Add the missing CSS directive for pixelated projects.
* Fix checkboxes at extensions and module settings not showing the actual value's state
* Fix `ct.mouse` returning old coordinates if a camera has moved, but a cursor hasn't.
* Fix incorrect drawing of scaled copies in the room editor.
* Fix issues with camera movement at room editor with extreme zooming factors.
* Fix modules' extensions being parsed at the exporter if they have undefined or unset (equal to -1) secondary keys.
* Fix overflow issues and wrong initial values for bitmap font generator.
* Fix regression from v1.4 with blurry particle editor and room view when pixelart rendering was enabled.
* Fix `user-select` CSS parameter on modules' docs panel.
* Hotfix: fix font import issues on Windows, as well as fix potential similar issues for other asset types

### 🍱 Demos, Dependencies and Stuff

* Add the missing link to the bitmap fonts page in the navigation panel.
* At the platformer tutorial, fix a typo in collectibles title.
* Bump various catmods' versions.
* Fix small error in describing key input in the asteroid shooter tutorial.
* Fixed bitmap fonts docs. The `font` in the constructor should be an object.
* Specify the tab for enemy/asteroid generation code at space shooter tutorial.
* Update electron-packager to v15.0.0. Fixes build issues for Windows.

### 📝 Docs

* Add info about moddable copies' extensions
* Document new input types `slider` and `sliderAndNumber`, as well as additional settings for them

### 🌐 Website

* :sparkles: Presskit

### 🌚 Misc

* :fire: Remove keymage.js, as it is not used anymore
* :fire: Remove keymaster.js, as it is not used anymore


## v1.4.1

*Sun Aug 10 2020*

### 🐛 Bug Fixes

* Fix indefinite behavior after placing copies and switching to the properties tab in the room editor
* Fix loading error while migrating a project without tile layers to v1.4.0
* Fix regression with custom script typings: they were not loaded on project load
* Fix type picker being empty right after opening the room editor
* Icons in the room editor, on the left side, should be centered if no labels are shown next to them.

## v1.4.0

*Sun Aug 09 2020*

### ✨ New Features

* Bitmap fonts — see new docs on how to use them. These fonts solve issues with blurry pixelart fonts in games, and also provide higher performance for dynamic text!
* `ct.assert` module for readable checks in ct.js projects
* `ct.camera` now supports direct assignment for its scale, e.g. `ct.camera.scale = 1.5;`
* `ct.inherit` module that allows you to call parents' code and keep things DRY
* Custom font selector in the style editor
* Lucas Dracula theme — A rough port of Arkham theme for VSCode by @lucasmsa
* Modding: `onbeforecreate` injection
* Modding: A `code` input type for monospace text input
* Modding: Add `point2D` input type for modules' settings and injections
* Modding: Add extensions for rooms with `roomExtends` field
* Modding: Add extensions to tile layers with `tileLayerExtends` field
* Modding: Both module settings and asset extensions now can use all the input fields that were previously exclusive to either modules' settings or type extensions
* Module's settings are now parts of the Project Settings' tab
* Quickly create a new type by right-clicking an asset in the textures panel
* Unified module's docs in the side panel

### ⚡️ General Improvements

* Allow `ct.fittoscreen` to toggle fullscreen mode while being in an electron app (in a desktop build)
  Closes #155
* Allow games enter fullscreen while being in debugger
  See #155
* Better project selector background for night themes
* Better layout of a type editor
* Change `ct.place.tile` to check against collision groups (new!) instead of depth
* Improve Horizon theme
* Make the structural behavior of TileLayer consistent. Fixes drawing issues with tiles and `ct.place` debug mode
* Minor UI fixes for the project selector
* More logical color hierarchy — you will see subtle changes in how certain panels are colored in dark and light themes, and all themes should now have uniform look and feel
* Move depth input at the type editor into a scrollbox, on par with module-provided fields
* New icons for the top panel
* Refurbish project's settings screen
* Remove empty "help" field from ct.place > module.json
* Replace node-static for dev and docs servers with serve-handler. Solves rare race conditions while loading docs or a game.
* Show a loading icon while exporting project
* The left button group at the topmost tab bar now occupies less space on wider screens
* Update Russian UI translation
* Update Spanish translation for ct.IDE. Update by Stuck Up Creations from the Discord server :sparkles:
* Update debug translation file and comments file
* Use less restrictive YAML reader/writer to allow some minor save file errors

### 🐛 Bug Fixes

* Do not reuse tiles directly from room templates
  Closes #191
* Fix blank autocompletion list at room-events-editor
  Closes #195
* Fix `ct.tween.add` not working as expected for useUiDelta
  See #198
* Fix the first tile layer not being added into a drawing stack at room-editor, which made tiles invisible unless a copy or background was added
  Closes #206
* Fix wrong default setting for `ct.fittoscreen` module
* Replace unzipper module and fix issues with module imports

### 🍱 Demos, dependencies and Stuff

* Update Howler.js to v2.2.0

### 📝 Docs

* Split "Making catmods" docs into several pages;
* Document the usage of new asset extensions and input types;
* Document the usage of BitmapFonts;
* Update screenshots and directions for tutorials, to reflect UI changes in v1.4.

### 👾 Misc

* :fire: Remove export options: HTML and CSS are now always minified, and JS conversion never worked correctly
* :fire: Remove a button in the nav that toggles fullscreen view
* Minor fixes to the debugger files (#197 by @leedigital)

## v1.3.0

*Wed May 06 2020*

### ✨ New Features

* :globe_with_meridians: Add a Chinese Simplified translation (#164 by @emaoshushu)
* :globe_with_meridians: Add a Polish translation by Voltinus from Discord :tada:
* :globe_with_meridians: Add Dutch language to IDE (#182 by @BartInTheField)
* Add a "troubleshooting" submenu to main ct.js menu
* Add a `reset()` method to CtAction
* Add `ct.deltaUi` for steady UI animations at slowmo effects
* Add `ct.gamepad` module, made by collective efforts from @leedigital, SN from Discord, and Comigo
* Add touch controls for catformer and catsteroids (#178 by @naturecodevoid)
* Allow to set depth through extensions in `ct.types.copy` fourth parameter
* An onboarding screen when creating a new project
* Catmods can now express their dependencies on other mods with `dependencies` and `optionalDependencies` fields
* Configure texture's padding to avoid bleeding artifacts on strongly scaled textures
* `ct.camera`, UI and game coordinates, and nested rooms
* `ct.fs` - a module for working with files and game saves
* `ct.transitions` for nice and smooth transitions in your game!
* `ct.types.exists` to check whether a given copy exists in game's world
* `ct.timer` (#179 by @naturecodevoid)
* Dark theme support in docs panel
* Favicons and customizable loader for your games, at your project's Settings tab
* New injection for catmods — `rooms.js`
* Particle systems, yaaay! :tada:
* Reorder scripts at your project's Settings tab (#181 by @naturecodevoid)
* Rotate copies in the room editor through a context menu
* Stretch debugger's console and flip its layout
* The sidebar in the room editor is now resizeable
* UI scale in ct.IDE (#180 by @naturecodevoid, see it in the hamburger menu > Settings)

### ⚡️ General Improvements

* :globe_with_meridians: Update Debug and Russian translation files
* :globe_with_meridians: Update French translation (#176 by @FoobarIT)
* :globe_with_meridians: Update German translation (#153 and #172 by @Wend1go)
* `ct.flow`, `ct.u.wait`, `ct.tween` now operate based on ct.delta, with optional ct.deltaUi mode (#179 by @naturecodevoid)
* Add a bit of logic to reset crop size on single-frame textures
* Add a spacer between "Image's center" and "Isometrify" buttons in the texture editor
* Add home-brewed i18n coverage reports and language file checkers to CI
* Add simple typings for `window` and `document`
* Add typings for `ct.rooms.list`
* Change cursor to "progress" state when exporting a project
* Export games as electron app. Bonus: new supported architectures! :sparkles:
* Forbid building for Mac from Windows, because Windows is shit
* Improve error message with broken TTF fonts
* Improve typings for `Copy.tex`
* Improve typings for `ct.camera`
* Lay out language menu in two columns
* Remove the extra border at a room's script editor
* Remove unnecessary update after a skeleton was imported
* Replace icons for rooms and textures
* Run some tasks of the exporter in parallel, shortening the time it takes to compile your games
* Set starting mode for desktop games: windowed, fullscreen, or maximized
* Store projects in YAML format: better conflict resolving in git and more human-readable source files
* Types now automatically rename to the name of a picked sprite
* UI: Add a margin to the "Settings" header on the same-called tab
* Update `ct.vkeys` to work with the new UI coordinate system
* Update typings for `ct.tween`
* Variables defined in scripts at the settings tab are now visible by code editors. No more red squiggles!

### 🐛 Bug Fixes

* Add missing typings for sessionStorage and localStorage, that are needed for saving game data in a browser
* Add missing typings for xstart and ystart in copies
* Add the missing `depth` property of the `Copy` class
* Add the missing typing for `ct.rooms.current`
* Ensure that "includes" folder exists when opening it through the main menu, as it may be absent, e.g. after pulling a new project from a git repo
* Fix 3D sounds of `sound.howler`
* Fix a case when `this.kill` is applied to backgrounds or tilesets and ct.js can't delete them
* Fix broken button that moves all copies in a room editor
* Fix broken ct.mouse `Wheel` input
* Fix context menu in the Fonts section > "rename" command doing nothing
* Fix issues with re-imported textures
* Fix OnDestroy not always being called on copies that got deleted because of others' OnDestroy code
* Fix shadow style on notepad panel on dark themes
* Fix style issues at html.js
* Fix the bug when importing a module if it does not contain a parent directory (#157 by @leedigital)
* Fix the incorrect typing for `ct.speed`
* In `ct.touch`, mouse clicks should trigger `Any`, `Double`, `Triple` inputs
* Prevent images in a room's type picker from dragging
* Remove extra border at the top of type's code editor
* Show imported fonts immediately
* Update ct.fittoscreen to work with high density screens

### 🍱 Demos and Stuff

* Add full JettyCat example
* High-quality textures for Memocats
* Improvements of examples
* Pull the latest docs
* Refurbish Catsteroids example: add a boss battle, new bonus, and new graphics
* Update Yarn Spinner example

### 📝 Docs

* :sparkles: New tutorial: JettyCat
* Indent the warning about shape optimizations in `ct.place.tile`
* Add a link to Discord server at the issue creating screen
* Add missing quotation mark in mouse catmod changelog (#173 by @Wend1go)
* Fix "optionable" in docs for `ct.transition`

### 🌻 Misc

* :fire: Remove ct.libs property from exported games


## v 1.2.1

*Tue Nov 26 2019*

### 🐛 Bug Fixes

*  ct.IDE should use pixi.js-legacy internally as well, otherwise style editor breaks everything

## v 1.2.0

*Tue Nov 26 2019*

### ✨ New Features

* A new, better code editor with live type checks, built-in doc popups, and more!
* Add a render option to include a legacy renderer for older browsers
* Choose a custom folder for a project when creating it (#138 by @leedigital)
* Hotkeys for most tabs and resource creation
* Import modules from a *.zip file, in the Catmods tab (#142 by @leedigital)
* Patreon screen
* Resize the viewport with ct.width and ct.height
* Show/Hide the mouse cursor with ct.mouse.show, ct.mouse.hide (#143 by @Wend1go)

### ⚡️ General Improvements

* Add a `finally` method for cutscene's promise-like objects
* Add patreon translation to German (#140 by @Wend1go)
* Allow to change ct.fittoscreen's scaling mode at game's runtime
* Create dummy typedefs for modules that don't provide them

### 🐛 Bug Fixes

* An asset should not be allowed to apply if it has an already occupied name
* Fix broken zipped projects on windows
* Fix multiple tiles not being placed while the Shift key is pressed
* Fix non-working export settings on really old projects
* Show proper error message when switching to a non-existent room (#144 by @Wend1go)
* Update DragonBones and fix issues with skeleton import

### 🍱 Demos and Stuff

* Add typedefs for `ct.tween`
* Add typings for `ct.cutscene`
* Add typings for `ct.random`
* Add typings for `ct.vkeys`
* Complete typings for `ct.eqs`
* Typedefs for `ct.flow`
* Typedefs for `ct.touch`
* Typedefs for `ct.yarn`
* Typings for `ct.fittoscreen`
* Typings for `ct.sprite`

### 📝 Docs

*  Document `ct.width` and `ct.height`
* :bug: Fix mistakes in `ct.eqs`' docs
* :sparkles: Complete translation of Pt-BR docs
* :zap: Add a clarification to the second variant of a platform's code at tut-making-platformer
* :zap: Document the process of adding typedefs for modules
* :zap: Update tut-making-platformer.md (by @Eilandis)

### 🌐 Website

* :bug: Fix a link to site's code license in the footer
* :bug: Fix emojis in 1.1.0 changelog entry
* :bug: Fix links in reusable stuff
* :sparkles: A proper language selector
* :sparkles: PT-BR translation on ct.js-site (by @GumpFlash)
* :zap: Add a translated contact form for Russian locale
* :zap: Better adaptivity
* :zap: Better handling of optionally translated pages
* :zap: Make the page "made with ct.js" dynamic and based on itch.io engine page
* :zap: Tons of improvements here and there
* :zap: Tons of new icons

## v 1.1.0

*15 October 2019*

### ✨ New Features

* Add a debug mode to ct.place (you can find it in the settings tab)
* texture-editor: Add the Symmetry tool for polygonal shapes (by @schadocalex)
* Add Iosevka as a default typeface for code, allow setting your own typeface, control line height and ligatures
* Open the `includes` folder from the hamburger menu
* Support for nested copies (#127) by @schadocalex
* Support for Yarn (a tool for making dialogues and interactive fiction), powered by bondage.js
* texture-editor: Directly add/remove shape points on texture with your mouse. Add a point by clicking on the yellow line segments, delete points by clicking on them (by @schadocalex)

### ⚡️ General Improvements

* Add Pt-Br translation of UI by Folha de SP from Discord
* Better checkboxes, radio inputs, and other fields
* Better styling of inline code fragments in the modules panel
* Better texture-editor layout
* Better, more readeable tables in module's docs
* Change Horizon colors a bit to make it more pleasant to look at
* Highlight code blocks at modules panel
* Improve texture packing
* Make module list and their details scroll independently
* Remove excess borders in nested views
* Remove excess borders on module panels
* Remove old language keys, add Comments.json, Debug.json
* Rename "Is tiled" property of textures to "Use as background", hide splitting tools if used as background
* texture-editor: Make the axis handle squared (by @schadocalex)
* texture-editor: Zooming in/out now works when scrolling outside the texture as well (by @schadocalex)
* Tiny UI improvements, here and there

### 🐛 Bug Fixes

* :pencil: Replace Lato's license with Open Sans', as we don't use Lato
* Color inputs should show white value on a dark background from the very start
* Fix broken style editor
* Fix numerous collision problems that appeared with rotated entities
* Fix the checkbox "close the shape", as it didn't change the actual state before
* Stop chromium from messing up with color profiles and colors in ct.js

### 🍱 Demos and Stuff

* Add a Yarn demo

### 📝 Docs

* Document the `alpha` property of copies
* :zap: Update Troubleshooting — teared backgrounds
* :bug: Update tut-making-shooter.md
* Pt-Br translation :tada:

### 🌐 Website

* :bug: Fix an outdated link to downloads in the header
* :sparkles: Add partial Russian translation
* :zap: Align social icons at the footer to the right


## v 1.0.2

*25 September 2019.*

### 🐛 Bug fixes

* Fix broken desktop export, as well as uncatched errors
* Fix textures' "frame count" property not working (#120) by @island205 🎉
* Update parameter names in ct.sprite's readme

### ⚡ General improvements

* Add support for OGG audio files

### Docs

* 🐛 Fix the use of ct.height in Making Shooter tutorial when ct.viewHeight is needed
* ⚡ Change the title of "Troubleshooting: Background splits into squares!" so that it covers tiles as well
* Add a page "Troubleshooting: Sounds don't play at game start!"
* Document `ct.u.degToRad`, `ct.u.radToDeg`
* Document `ct.u.rotate`, `ct.u.rotateRad`


## v 1.0.1

*5 September 2019.*

### 🐛 Bug Fixes

* Fix the broken sound import
* Fix improper movement of vertically repeating backgrounds
* Add actions to new projects. Fixes the issue with "project.actions are not iterable"

### ⚡ General improvements

* Update Open Sans font, so it supports extended Latin characters

### 🐙 Misc

* Remove the deprecated copies' method `this.draw`

## v 1.0.0

*1 September 2019.*

### 🐛 Bug Fixes

* Debugger should never run in fullscreen mode
* Fix broken packages for MacOS
* Fix MacOS access issues
* Fix `ct.sound.globalVolume` method
* Fix Ctrl-plus and Ctrl-minus hotkeys on code editors
* Fix improper archives generated by "export to zip" command
* Fix migration code that was re-applied on already updated/newly created projects
* Fix module settings panel not working for modules with dots in their name
* Fix security issues in npm packages
* Fix unstable movement under different FPS in the Catformer example

### 📝 Docs

* Add an entry about pausing a game, in "Tips & tricks"
* Document `ct.sound.spawn` options for `ct.sound.howler`
* Make a vague description of `ct.sound.howler` use relative to `ct.sound` more clear
* Fix links that led to a now deprecated name of `PIXI.AnimatedSprite`

### 🍱 Examples & Demos

* Add a scale-in animation to cards in Memocats example
* Refresh Catformer project file

### ⚡ General improvements

* Add a parameter for `ct.touch.hovers` to ease handling touchend (touch release) events.
* Add a party carrot to the "new version available" notice at the starting screen
* Add `ct.delta` to code completions
* Add `ct.touch.enabled` property to determine whether a device is using touch events
* Better alignment of the project selector
* Better highlighting of paired brackets, by @qualitymanifest
* Better QR code legibility on dark themes in the integrated debugger
* Catch the case of `mouse.legacy` with manually updated projects made in a dev version between next-2 and next-3
* `ct.sound.howler`: Update `howler.js` to v2.1.2
* Enable local code completions
* Make ct.js message in console even prettier
* Update PIXI to v5
* Set a max width to a project selector, so that it is usable on smaler screens

### 🌐 Internationalization

* Add a German translation by Wend1go from GitHub.
* Add a Spanish translation by FoxamStudios (Stunx from Discord).
* Add a Romanian translation by andithemudkip aka ((andi)) from Discord.

Nice work, mates!

### ✨ New Features

* Add a `ct.cutscene` module
* Add a setting control to support retina screens
* Add a settings field for max FPS
* Add an ability to set a custom font for code editors, currently by devtools only with `localStorage.fontFamily = '...'`
* Add `ct.flow` module for easier asynchronous flow control
* Add `ct.u.degToRad`, `ct.u.radToDeg`
* Add virtual joysticks to `ct.vkeys`
* Control the rate of sounds at ct.sound.spawn
* Horizon UI theme
* Spacial plugin for Howler.js: add 3D sounds to the ct.sound.howler module
* Support `ct.touch` module in `ct.vkeys`
* Update `ct.touch` to v2.0.0: support for Actions system, pinch, rotation and panning gestures


## v 1.0.0-next-3

*1 April 2019. Not a joke.*

### ✨ New Features

* Introduce Actions — a new unified system for any input methods

### ⚡ General Improvements

* Add a pool for killed copies to limit garbage collection calls
* Remove non-existent modules from a project, if there are such

### 🍱 Demos and Modules

* Add keyboard.polyfill for IE and old browsers. Enable it by default in new projects
* Update demos and tutorials

### 🐛 Bug Fixes

* Bundle scripts of catmods on one level with ct.js (this solves issues with itch.io and GameJolt games)
* Clarify a cryptic error that appears if one provides a non-existing type name to `ct.types.copy`
* Clear input value to be able to reselect the same font
* Display a catmod's license on the "Info" tab
* Fix a font not showing up after being renamed
* Fix an issue when you can't import the same texture twice in a row
* Fix ct.mouse.down not working
* Fix ct.room.followDrift overshooting on low values and low FPS
* Fix ct.touch that used `ct.width` and `ct.height` instead of `ct.viewWidth` and `ct.viewHeight`, resulting in incorrect coordinates on some scaling methods
* Fix ct.u.ext not returning the extended object
* Fix flawed `this.xprev`, `this.yprev` handling in ct as it is and in ct.place
* Fix UI problems of font deletion
* Fix importing font on Windows
* Fix mouse coordinates not updating on view shift (in-game)
* Fix non-working "Open" options in context menus for rooms, sounds and textures
* Fix wrong calculation of rotated rects in ct.place, that turned rectangles into points
* Prevent unwanted name change when importing a sound
* Remove this.updateList(); call that caused a UI update error after deleting a font
* Update ace.js autocomplete list
* Update graphics, sounds, rooms panels after opening a project from a hamburger menu
* Update shape and anchor of a copy while changing a texture
* Update the type picker in the room editor after deleting a type
* Refresh the preview immediately when activating fill and selecting diffuse in a style

### 💄 UI Improvements

* 🎨 Rename "graphic assets" into "Textures"
* Add a zoom control to graphics editor
* Add an icon in the module info that shows that a module provides additional input methods

### 📝 Docs & Tutorials

* Add an example to ct.inputs.addAction
* Document actions and ct.inputs
* Document ct.sound.playing
* Document ct.vkeys
* Document the way of adding new input methods with catmods
* Fix `ct.keyboard.clear();` docs
* Provide docs for the new ct.mouse
* Rename "Graphic assets" into "Textures"
* Tons of minor fixes in tut-making-platformer
* Update Platformer_tutorial
* Update Space Shooter tutorial
* ⚡️ Add a link to ct.u that shows a difference between a shallow and a deep copy
* ⚡️ Clarify ct.u.unlerp
* ⚡️ Minor fixes and clarifications at Making Space Shooter tutorial
* ⬆️ Update vuepress to 1.0@next
* 🌐 Add ct.md for Ru locale
* 🌐 Add readme.md and tut-making-platformer for RU locale
* 🌐 Translate "Making Space Shooter" tutorial to Russian
* 🌐 Translate catmoddocs.md to Ru
* 🌐 Translate ct.inputs.md to Ru locale
* 🌐 Translate ct.res.md to Ru locale
* 🌐 Translate ct.rooms.md to Ru locale
* 🌐 Translate ct.sound.md to Ru locale
* 🌐 Translate ct.styles.md to Ru locale
* 🌐 Translate ct.types.md to Ru locale
* 🌐 Translate ct.u.md to Ru locale
* 🐛 Move a note about event sequence and `this.kill` to the right place at ct.types.md
* 🐛 Update ct.md to reflect v1.0
* 🐛 Update ct.res.md
* 🐛 Update description of ct.rooms.switch
* 💥 Remove ct.mouse. Document the change in the migration guide.

### 👽 Misc

* ⌛ Provide docs for ct.mouse.legacy
* ⌛ Add a legacy version of ct.keyboard
* ⌛ Connect legacy versions of ct.keyboard and ct.mouse to older projects
* ✏ A typo in autocompletion: ct.types.addSpeed has (copy, speed, dir) parameters
* 🍎 Add long-press menus for Mac

## v 1.0.0-next-2

*28 January 2019*

### ✨ New Features

* Add `ct.room.followShiftY`, `ct.room.followShiftX`
* Add a `ct.place.moveAlong` method that allows for continuous movement in a given direction.
* Add horizontally and non-repeating backgrounds to rooms
* Add support for complex collision shapes
* Add support for DragonBones skeletal animation
* Catmods: add a 'radio' input type
* Catmods: define additional fields in the type editor
* ct.place: Add `this.moveContinuous` to all copies
* Multiple copy editing in room editor
* Repeat-x, repeat-y and no-repeat options for backgrounds

### ⚡ General Improvements

* Add a `multiple` flag to ct.place.occupied, ct.place.meet that allows to get all the copies that participated in collision.
* 💄 (x,y) position of the mouse in the room editor.
* 💄 Add an HTML/CSS preloader to exported games
* 💄 Add "Recent Projects" to the hamburger menu
* 💄 Add an ability to forget projects in the "Recent Projects" list
* Add `ct.place`, `ct.fittoscreen`, `ct.keyboard`, `ct.sound.howler` and `ct.akatemplate` by default to all the new projects
* Add `ct.sound.exists` method
* Add support for sound events in DragonBones skeletons
* Allow to set an empty sprite to a copy by changing `this.graph = -1;`
* `ct.place`: add a ctype input to type editors
* Introduce `ct.viewWidth`, `ct.viewHeight`.
* Make backgrounds resilient to missing extends
* Remember window position on load (ct.IDE)
* Update `ct.place`
* Update fittoscreen to v2.0: add more scaling methods for fine quality at a wide variety of resolutions
* ⬆ Update Pixi.js to v4.8.5

### 💄 UI Improvements

* ⚡ Autofocus code editors on tab change
* ⚡ Make text and code in module panel selectable
* Add nifty sounds to notifications
* Crop long paths to recent projects on the left side
* Show a message about where the project and the exported version were zipped, because some systems (e.g. Windows 10) don't show the files in file managers

### 🐛 Bug Fixes

* 💄 Add a "cancel" button while selecting a tileset
* Fix desktop exporter not picking the first room as the starting one if no room was marked as such
* Fix exporter for desktop platforms
* Fix parallax + non-repeat background behaviour
* Fix project loader not loading the most old ct.js projects
* Fix unwanted interpolation on stretched sprites if "Disable image smoothing..." is checked
* Remove autosave errors in dev console that appeared while no project was loaded

### 🍱 Demos and Stuff

* Update catformer demo to v1.0.0-next-2
* Update demos and examples

### 📝 Docs

* Add a deprecation notice to `ct.place.legacy`
* Add a notice about dragonBones animation events
* Add tips & tricks for effective viewport management
* Document new catmods' capabilities
* Document the import process and usage of skeletal animations
* Document `this.moveContinuous` at ct.place readme
* Finish JS Intro, pt 2
* Fix flipped directions in a tip at https://docs.ctjs.rocks/tut-making-shooter.html#moving-hostiles-and-asteroids
* Rename `ct.place.go` attribute `speed` to `length`
* Update tutorials to v1.0.0-next-2


### 📄 License

* Add a ct.js version with website link to console output
* Add SSCD license
* Adding a Pixi.js license (3rd-party)
* Formatting license, adding a Termination section
* License: Add DragonBonesJS license (3rdparty)

### 👽 Misc

* 🌐 Add a link for crowd-sourced translations
* 🌐 Add a partial French translations by Vactro
* ⁉ Add `./` to all resource paths to load, because itch.io
* 💩 Bump ct.keyboard version to v2.0.0, because it should have beeen bumped before.
* 🔥 Remove ffmpeg-node for now
* 🔥 Remove vkontakte link in the starting screen, because I no longer use vkontakte
* 🚚 Rename old `place` module to `place.legacy`

## v 1.0.0-next-1

*1 December 2018*

### ✨ New Features

* ⚡ WebGL Renderer
* ⚡ Ctrl+S and autosave/recovery feature
* ⚡ Additional fields for backgrounds: movement, shifting, parallax and scaling

### 💄 UI Improvements

* ⚡ Show axis in graph editor
* ⚡ Make graphic selection in type and room editors for backgrounds cancellable

### 🐛 Bug Fixes

* Fix memory leak when updating room with opened backgrounds tab
* Fix memory leak on room switch in ct.place
* Fix color pickers not returning their intermediate values to editors

### 🍱 Demos and Stuff

* Update example projects to v1.0-next-1

### 🔥 Removed

* Remove ct.draw.patch, ct.canvas

### 📝 Docs

* Add a migration guide
* Add a note about tearing backgrounds when they are not marked as "Tiled"
* Update Space Shooter tutorial
* Update Platformer tutorial
* 💥 Write docs for new ct.styles

### 📄 License

* Add nw-builder license notice (3rd party)

### 👽 Misc

* ✏️ Add 'A' to the font editor
* ✏️ Fixing minor issues in Russian localization file
* 💥 Changing ct.styles API to work with Pixi.js
* 💥 Repurpose styles editor to making pixi's TextStyle

## v 0.5.1

*7 November 2018*

### 🐛 Bug Fixes

* Fix autocompletion being triggered on `;` and line end
* Fix project update for older versions not working
* Fix ct.place.tile moving copies around by itself

### 🍱 Demos

* Update tutorials' project version

## v 0.5.1

*30 October 2018*

### 🐛 Bug Fixes

* Fix missing fields in newly created projects.


## v 0.5.0

*27 October 2018*

### ⚡ General Improvements

*  Add a /\*%commented%\*/ format for modules' configurable fields, as an alternative to the %standard% one.
*  Improvements to ct.place: greatly improve speed for ct.place.occupied, ct.place.free, ct.place.meet, ct.place.tile. Make x and y parameters in most functions optional. The new variant is now preferred (e.g. ct.place.occupied(this, 'Solid'); )
* Little performance optimizations for drawing
*  Make a small transition to a prototype-based system. Introduce `this.draw`, `this.move` and `this.addSpeed` calls on copies.
* More zoom levels in the room editor
* Refactor ct.types, move actual types to ct.types.templates
* Reuse of metadata in ct.js and exported projects

### ✨ New Features

* Add a font manager
* Add a Reimport button to imported graphics assets
* Add ct.js autocompletions for code editors
* Add ct.u.deltaDir, ct.u.lerp, ct.u.unlerp, ct.u.clamp, and ct.u.inspect
* Add multi-selection for tiles

### 🐛 Bug Fixes

* Fix ct.place.nearest and ct.place.furthest
* Fix drawing copies with graphics offsets in the room editor
* Fix incorrect export of tilesets with non-square grids

### 📝 Docs

* Add a notice about location of catmods' docs
* Visually better tips in tutorials and minor changes

### ⚗ Experimental

* Add ct.eqs and ct.victoria catmods
* Project exporter

### 💬 Misc

* Add a link to Patreon
* Add links to Twitter, Discord and VK to the starting screen

## v 0.4.1

*25 September 2018*

### ⚡ General Improvements

* A better error message from ct.tween when switching to a new room.
* Add a search/sort panel to the graphic selector
* Add an option to ct.touch to disable default events prevention on touches, allowing to use ct.mouse on mobile devices, too.
* ct.rooms.make now returns an array of created copies.

### ✨ New Features

* Add a ct.draw.patch module
* Add an 'Isometrify' button to the graphics editor
* Add ct.u.wait method
* Resize copies and set their precise coords while in room editor

### 🐛 Bug Fixes

* Fix ct.canvas.drawTileExt
* Fix graphics sometimes unavailable at room editor

### 💄 UI Improvements

* Better QR code legibility on dark themes
* Move all thumbnails to the left side

### 📝 Docs

* Add a link to the Discord server to the docs
* Add a tutorial about localStorage and game saves

## v 0.4.0

*13 September 2018*

### ⚡ General Improvements

* Add a room's name to its properties in the exported project
* Add a Shift modifier to place multiple copies or tiles at a room at once
* Add conversion to ES5
* Add QR codes and local addresses to the preview window
* Add tile culling
* Disable scaling and set proper width on mobile devices. Combine it with ct.fittoscreen to make your games mobile-ready (graphically)
* More consistent and intuitive tile and copy placement on grids in room editor
* More consistent behavior of ct.fittoscreen
* Move room templates to a JS object ct.rooms.templates
* Reorder room creation process to allow modifying room's view by copies' On Create code
* Set ct as a JavaScript object, move the canvas tag and all its properties to ct.HTMLCanvas

### ✨ New features

* Add `ct.touch` module
* Handling of copy-tile collisions with `ct.place.tile`
* Integrated debugger
* Show/hide certain tile layers

### 🍱 Demos

* Add a Platformer tutorial example project and its assets
* Update Catformer demo
* Update Catsteroids demo

### 🐛 Bugs Fixed

* Clean up logical assets after deleting a type or a graphical asset
* Fix checkboxes on the Settings tab not showing their saved state
* Fix HTML / CSS minification not working
* Fix preloader and random startup errors
* Room editor: Fix Shift and Ctrl modifiers working after a context menu was called.

### 💄 UI Improvements

* A bit better buttons
* Fix copy palette being visible on room's events screen
* Prevent clipping of sprite sheet settings at graphics editor on smaller screens. Move collision shape show/hide control to the left column.
* Tile editor improvements

### 📝 Docs

* Add a Platformer tutorial
* Add info about ct.js engine to docs' homepage
* Document ct.place.tile

### Other

* 📄 License: Remove edit prohibition for 3rd party libraries
* 💬 Rename 'Graphic' to 'Graphics'
* 🔖 Bump ct.fittoscreen version
* 🚚 🍱 Move SpaceShooter demo to a better location
* 🍱 Add a simple .desktop file for linux


## v0.3.1

*24 August 2018*

### ⚡ General Improvements

* Rectangular grids in room editor

### ✨ New Features

* Support for tilesets! **An early version, EXPERIMENTAL**

### 🐛 Bug Fixes

* Fix a bug preventing picking a background
* Fix a bug preventing to delete a room with a context menu
* Fix FPS input in graph editor not working
* Fix modal dialogues with 'Delete' labels instead of 'Ok'
* Replace JS minifier to support ES6

### 💄 UI Improvements

* Changes to number fields in style and graphic editors now affect preview panes instantly
* Search and sorting for room editor with minor UI improvements
* Show a warning when using duplicate names in assets

## v0.3.0

*17 August 2018*

### ⚡ General Improvements

- Add ct.draw.img as an alias to ct.draw.image
- Add optional x and y parameters to ct.draw()
- Git-friendly asset identifiers
- Make x and y in ct.types.copy optional
- Pre-initialize ct.types.list with empty arrays for each type
- Support new Keyboard API standard
- Update mouse position each frame
- Update mouse position each frame; better ct.mouse.imside resolution

### ✨ New Features

- 💄 Dark theme!
- Add a ct.sprite catmod

### 🐛 Bug Fixes

- Enable code checking in editors
- Fix an error in module.json of ct.canvas module
- Fix bugs when cancelling the an asset's duplicate creation
- Fix flipped orientation in ct.draw.imgext
- Fix pattern drawing with styles
- Fix pixelated render not fully working
- Fix styles' line width not exported correctly
- Fix texture selection in the styles editor
- Room size must be exported as numerical values
- Update the graphic asset in the editor's memory after replacing its source

### 💄 UI Improvements

- Add a "Copy the name" option to assets' context menus
- Better modal dialogues
- Custom Scrollbars
- Different minor UI improvements
- Open the sound after its creation
- Sort and search fields in resource views
- Wider room thumbnails

### 📄 License

Added license. TL;DR:

- You own your assets, projects, catmods;
- You can use the app for commercial use (and other uses too);
- You must not modify the ct.js in any ways that were not intended for it by the Author;
- We do not give any guarantees and are not responsible for any damage.

### 📝 Docs

- 🐛 Fix minor mistakes in ct.types docs

## v0.2.0

*05 August 2018*

### ✨ New features

- 💄 More options for sounds and better UI
- Add custom scripts to your project
- Introduce ct.place.go and ct.place.trace methods
- Launch a static server for exported projects
- "Line — everything" collision detection in ct.place
- New ct.sound.howler module
- New ct.fittoscreen module

### ⚡️ General Improvements

- 🐛 Minor changes to the standart ct.sound
- 📝 Launch docs locally — now the docs for your particular version are bundled with ct.js and are available offline
- Make ct.mouse aware of possible view scrolling and scaling

### 🐛 Bug fixes

- Export unchecked ‘checkbox’ fields as false, not as an empty string
- Fix a bug in ct.draw.polygon.close, ct.draw.polygon.fill, ct.draw.polygon.stroke
- Fix ct.u.prect function not working with mirrored coordinates
- Fix exporter not copying includes folders of ctlibs
- Fix occasional failures while loading new images
- Fix wrong extensions of exported sounds

### 💄 UI improvements

- Make docs blue!
- Add a button to return to docs’ homepage
- Better presentation of ‘checkbox’ options of catmods
- Fix list overflow if there are too many resources

### 📝 Docs

- Add missing file extensions in “Creating your own mods” page
- Remove unexisting config fields of catmods, document the "help" field
- Reflect changes of ct.sound API

### 🍱 Updated demos

- Update Catformer demo with fullscreen option
- Update Catsteroids with ct.sound.howler

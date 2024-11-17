# ⚠️ New repository here: https://github.com/ct-js/ct-js

This is an older repo that has large binary files and other junk in git history left due to early stupidity or human errors.
The new repo is at least 5 times smaller in size and clean from those errors.

⚠️ You will need to either hard-reset onto the desired commit in the new repo or re-clone/re-fork the git repository on your side.

![](https://raw.githubusercontent.com/ct-js/ct-js/develop/branding/GithubHeader.png)

[![](https://img.shields.io/badge/license-MIT-informational?style=flat-square)](https://github.com/ct-js/ct-js/blob/develop/LICENSE) [![GitHub tag (latest by date)](https://img.shields.io/github/tag-date/ct-js/ct-js?label=version&style=flat-square)](https://github.com/ct-js/ct-js/releases) [![Gitlab CI master branch](https://img.shields.io/gitlab/pipeline-status/CoMiGo/ct-js?branch=master&label=ct.js%20builds&style=flat-square)](https://gitlab.com/CoMiGo/ct-js/-/commits/master) [![Gitlab CI develop branch](https://img.shields.io/gitlab/pipeline-status/CoMiGo/ct-js?branch=develop&label=nightly%20builds&style=flat-square)](https://gitlab.com/CoMiGo/ct-js/-/commits/develop)

[![](https://img.shields.io/discord/490052958310891520?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/yuvuDW5) [![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:to%20do?style=flat-square&label=todo%20issues)](https://github.com/ct-js/ct-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22state%3Ato+do%22) [![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/state:current%20release?style=flat-square&label=current%20release%20issues)](https://github.com/ct-js/ct-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22state%3Acurrent+release%22)
 [![GitHub issues by-label](https://img.shields.io/github/issues/ct-js/ct-js/help%20wanted?style=flat-square&label=help%20wanted)](https://github.com/ct-js/ct-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

# About

## What is ct.js?

**Ct.js is a 2D game engine and IDE** that aims to be powerful and flexible while still being easy to use and learn. It does that by providing extensive documentation, examples, a wide variety of game asset types and their visual editors — all while remaining open to modding, and if modding doesn't help, you can always put plain JS code in your project.

| | | Ct.js features | | |
|-|-|-|-|-|
| 🏗️ Level & UI editor | 🎶 Dynamic sound engine | ✨ Particle systems with a visual editor | 🧑‍💻 Several scripting languages to choose from | 🔔 Event-based scripting |
| 🖥️ One-click export for desktop platforms | 🌐 One-click export for web | 📱 Ready for PC and mobile games | 🔥 Fast, runs in WebGL | 💅 Free with no hidden subscribtions or fees |
| 🎞️ Frame-by-frame animations | 🗺️ Automatic atlas packing | 🕹️ Joystic support | ⌨️ Layout-agnostic input events | 🏁 Tilemap support |
| ⚽ Physics module | 👾 Arcade collision module | 🗂️ Local databases for complex data types | 🧠 Behaviors for gameplay logic composition | ✅ Base classes for UI elements |
| 🎨 Application branding | 🐻‍❄️ White-labelling | ➕ Add custom JS, CSS, or HTML | ⚙️ Flexible modular library | 📚 Extendable with special modules (catmods) |

People **code in ct.js with TypeScript, JavaScript, CoffeeScript, or ct.js' visual scripting language Catnip**. Coding is built around the event system, and shared code is implemented as behaviors that can be combined and used by several object templates or levels (as opposed to inheritance).

## How ct.js and its games are made?

**On a technical level, ct.js games are JavaScript applications that use WebGL for rendering.** While not the fastest runtime in the world, this setup is perfectly fine for modern 2D games and allows fast iteration, one-click web export — and two-click desktop builds as well!

Under the hood, ct.js games are based on a custom game framework plus [pixi.js](https://pixijs.io/) as its rendering and sound engine.

Ct.js as a game editor is a web application as well, based on the NW.js framework. The UI is component-based and is run on Riot.js v3, with most of the sensitive parts of the application written as TypeScript ESM modules.

## Why?

**Ct.js was made to be the cross-platform, always accessible integrated tool** that is not stuck in time like most other 2D game engines that use dated renderers, limited feature sets, and have hindering UIs. Ct.js lets you focus on your game's content without worrying about technical details like asset packing and loading, handling different screen resolutions, packing for desktop, and such.

Ct.js is opinionated and gamedev-centric. To make a game, you do not need to know web development or how to summon a demon — all the tools and knowledge are already in ct.js.

**And all this is to be free** — as in beer, as in freedom, and as a reproach towards companies too deep in their corporate greed.

## Support ct.js on product-hunting sites:

* [Like ct.js on AlternativeTo](https://alternativeto.net/software/ct-js/)
* [Rate ct.js on Slant in different questions](https://www.slant.co/options/30242/~ct-js-review)

# Production builds

See the [releases page](https://github.com/ct-js/ct-js/releases) or [jump to the itch.io page](https://comigo.itch.io/ct). Available for Windows, Mac and Linux.

# Nightly builds

We host [dev builds at itch.io](https://comigo.itch.io/ct-nightly). This page will have nightly versions that are built from the `develop` branch of our repository. It means that you will get the latest features, improvements, bug fixes, **and new bugs** daily, out of the oven. Use with caution and have fun. [The itch.io app](https://itch.io/app) is strongly recommended.

# Getting help

For bugs, feature requests, development questions, please use [GitHub issues](https://github.com/ct-js/ct-js/issues) so we can better track them. For general support about making games, ask a question at our [discord server](https://discord.gg/yuvuDW5).

# Repo structure & tools

* `app` — an [NW.js app](https://nwjs.io/), with its configs and static files.
    * `data`
        * `ct.libs` — catmods (modules) that ship with ct.js. Feel free to create a pull request with your module!
        * `i18n` — UI language schemes. Open for pull requests! :)
* `src` — a source folder that compiles into `/app` folder at a build time.
    * `ct.release` — the ct.js game library, aka its "core"
    * `js` — different top-level scripts, including 3rd-party libraries.
    * `node_requires` — shared JavaScript and TypeScript modules that cover exporter's functionality, asset management, utilities and such.
    * `riotTags` — components that drive UI logic in ct.js. Written in [Pug](https://pugjs.org/) and [Riot.js v3](https://v3.riotjs.now.sh/).
    * `styl` — style sheets, written in [Stylus](http://stylus-lang.com/).
* `branding` — logos and icons belong here.
* `docs` — official docs of ct.js. Edit them [here](https://github.com/ct-js/docs.ctjs.rocks).
* `SSCD.js` — [a fork](https://github.com/CosmoMyzrailGorynych/SSCD.js) of a collision library for ct.place.

# Developing ct.js

## Planning

Relatively large issues get posted in the [main dev board](https://github.com/orgs/ct-js/projects/5/views/7), along with issues that require help from the community. Prioritize the "Current release" column, then "To Do", then "Backlog", though if you really want a feature from a backlog to come true right here, right now, no one can stop you :)

Please leave a comment on issues you want to work on so that we can assign you to them and avoid occasional double work from several contributors.

You can chat and discuss ct.js development in [ct.js' Discord server](https://comigo.games/discord), in #engine-development channel.


## Forking and installing the dev environment

Building ct.js requires [Node and npm](https://nodejs.org/en/download/) installed on your machine.

```sh
git clone https://github.com/ct-js/ct-js.git ctjs
cd ./ctjs
npm install gulp-cli -g
npm install
gulp -f devSetup.gulpfile.js
```

## Running ct.js from sources

```sh
gulp
```

Use `gulp dev` instead of just `gulp` to run a dev service with live reloading without opening ct.js in its default manner. In either case, you can stop this service in the usual manner for your terminal, e.g. `Ctrl+C`. If you are encountering unexplained issues, especially when switching to a new branch, run `gulp -f devSetup.gulpfile.js` again.

VSCode can use [this extension](https://marketplace.visualstudio.com/items?itemName=ruakr.vsc-nwjs) to run ct.js with an attached debugger. Before running the debugger, to allow live reloading, run `gulp dev`.

## Linting

Linting checks for code formatting issues, runs ESLint, and also checks i18n files for extra keys.

```sh
gulp lint
```

There are also separate commands for running specific tests only:

```sh
gulp lintJS
gulp lintTags
gulp lintStylus
gulp lintI18n
```

## Getting your changes into production

It's actually easy and robust. We have [regular ct.js](https://comigo.itch.io/ct) for core releases and [ct.js Nightly](https://comigo.itch.io/ct-nightly) as a canary/preview build.

* Once your PR is approved and merged, it gets into the `develop` branch.
* Every change to `develop` triggers a CI build, and a new version of [ct.js Nightly](https://comigo.itch.io/ct-nightly) is released publicly.
  * To automatically update ct.js Nightly, we recommend using [the official itch.io app](https://itch.io/app).
* Every now and then maintainers decide to release a public version of ct.js — it involves version bumping, creating and cleaning changelog, updating screenshots, website, presskit data and such. Some stuff is automated, but it still involves manual work and public announcements on different channels. But if your change gets into `develop``, it means it will reach the `master` branch as well.

### Releasing ct.js

This is left for emergencies only, as Gitlab CI should prepare binaries for GitHub and send them to itch.io as well

```sh
# Builds docs and adds them to ct.js app
gulp docs
# Recompiles source files, bundles docs, and bakes binaries
gulp packages

# Publishes prebuilt binaries to itch.io
# This assumes that you have an access to ct.js at itch.io :)
gulp deployItchOnly
gulp deployItchOnly --channel next # deploy to a specific itch.io channel

# Creates a draft release on GitHub
# Needs a GITHUB_TOKEN in your environment variables.
# Does nothing on nightly releases
gulp sendGithubDraft

# Combines `gulp packages`, `gulp sendGithubDraft`, and `gulp deployItchOnly`
gulp deploy
```

The first run will be slow as it will download nw.js binaries. The next runs will use cached files.

## Naming conventions and references

Use [Gitmoji-flavored Comigoji](https://comigo.gitlab.io/comigoji/#gitmoji) for naming your commits.

Use [Comigo's CSS naming guide](https://cosmomyzrailgorynych.github.io/css-naming-guide/) for styling

We have some references for ct.js' internals on [our wiki](https://github.com/ct-js/ct-js/wiki).

The ct.js app has a built-in CSS stylebook in the Meta section of the main menu.

## Patrons

Ct.js is supported by these wonderful people:

<p align="center">
<img src="https://ctjs.rocks/patronsWidgetInlined.svg"/>
</p>

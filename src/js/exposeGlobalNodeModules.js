window.riot = require('riot');
window.signals = window.signals || riot.observable({});
window.orders = window.orders || riot.observable({});
window.PIXI = require('pixi.js');
window.PIXI.sound = require('@pixi/sound').sound;
window.PIXI.sound.filters = require('@pixi/sound').filters;
window.PIXI.particles = require('@pixi/particle-emitter');
window.hotkeys = require('src/lib/hotkeys')(document);

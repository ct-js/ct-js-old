'use strict';

/* eslint no-console: 0 */
import gulp from 'gulp';
import fs from 'fs-extra';
import {$} from 'execa';

const cleanup = () => Promise.all([
    fs.remove('./app/data/node_requires'),
    fs.remove('./app/data/docs')
]);

const npmInstall = path => () => {
    console.log(`Running 'npm install' for ${path}…`);
    return $({
        cwd: path || './'
    })`npm install`;
};
const bunInstall = path => () => {
    console.log(`Running 'bun install' for ${path}…`);
    return $({
        cwd: path || './'
    })`bun install`;
};

export const bakeDocs = async () => {
    await fs.remove('./app/data/docs/');
    // Patch the config file to serve the docs from /docs/
    const config = await fs.readFile('./docs/docs/.vuepress/config.js', 'utf8');
    await fs.writeFile('./docs/docs/.vuepress/config.js', config.replace('base: \'/\'', 'base: \'/docs/\''));
    await $({
        cwd: './docs'
    })`npm run build`;
    // Write the original config file back so there are no changes for git
    await fs.writeFile('./docs/docs/.vuepress/config.js', config);
    await fs.copy('./docs/docs/.vuepress/dist', './app/docs/');
};

const updateGitSubmodules = () => $`git submodule update --init --recursive`;


const fetchNeutralino = async () => (await import('./gulpfile.mjs')).fetchNeutralino();

const fetchPatrons = async () => {
    const {patronsCache} = await import('./gulpfile.mjs');
    return patronsCache;
};

const defaultTask = gulp.series([
    updateGitSubmodules,
    gulp.parallel([
        bunInstall('./'),
        npmInstall('./docs')
    ]),
    cleanup,
    gulp.parallel([
        bakeDocs,
        fetchPatrons,
        fetchNeutralino
    ])
]);

export default defaultTask;

/*
To append to the current changelog:

cat ./app/Changelog.md > ./app/Changelog.md.old
comigoji-changelog ./comigojiChangelog.js > ./app/Changelog.md
cat ./app/Changelog.md.old >> ./app/Changelog.md
rm ./app/Changelog.md.old
*/

const gitCommand = 'git log --max-count=1 --tags --simplify-by-decoration --pretty="format:%cI"';
const {exec} = require('child_process');

const miscEmojis = [
    '😱', '🙀', '👻', '🤖', '👾', '👽', '😜', '👀', '✌️', '🦄', '🐉', '🌝', '🌚', '🌻', '☄️', '🎲', '🎁', '😺'
];

module.exports = new Promise((resolve, reject) => {
    exec(gitCommand, function (err, stdout, stderr) {
        if (err) {
            reject(err);
            return;
        }
        if (stderr) {
            reject(new Error(stderr));
            return;
        }
        const since = new Date(stdout.trim());
        resolve({
            repos: [{
                since,
                repo: './',
                branch: 'develop'
            }, {
                since,
                repo: './docs',
                branch: 'master',
                forceCategory: 'docs',
                forceCategoryStrip: /^:(books|pencil|pencil2|memo):/
            }, {
                since,
                repo: './../ct-js-site',
                branch: 'master',
                forceCategory: 'website'
            }],
            categories: {
                rollback: {
                    pattern: /^:(roller_coaster|rewind):/,
                    header: '### 🎢 Rollbacked'
                },
                feature: {
                    pattern: /^:(rainbow|sparkles):/,
                    header: '### ✨ New Features'
                },
                improvement: {
                    pattern: /^:(zap|wrench):/,
                    header: '### ⚡️ General Improvements'
                },
                bug: {
                    pattern: /^:bug:/,
                    header: '### 🐛 Bug Fixes'
                },
                assets: {
                    pattern: /^:(briefcase|bento):/,
                    header: '### 🍱 Demos, Dependencies and Stuff'
                },
                docs: {
                    pattern: /^:(books|pencil|pencil2|memo):/,
                    header: '### 📝 Docs'
                },
                website: {
                    header: '### 🌐 Website'
                },
                default: {
                    header: `### ${miscEmojis[Math.floor(Math.random() * miscEmojis.length)]} Misc`
                },
                ignore: {
                    pattern: /^:(construction|doughnut|rocket|bookmark):/,
                    skip: true
                },
                merges: {
                    pattern: 'Merge pull request #',
                    skip: true
                }
            }
        });
    });
});

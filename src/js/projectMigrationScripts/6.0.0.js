window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '6.0.0',
    process: project => new Promise(resolve => {
        if (project.language === 'coffeescript') {
            project.language = 'civet';
        }
        resolve();
    })
});

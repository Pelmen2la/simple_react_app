const path = require('path');
const fs = require('fs');
const APP_CONFIG_FILE_PATH = '/server/config/app-config.json';

module.exports = function() {
    return new Promise(resolve => {
        fs.readFile(path.join(global.appRoot, APP_CONFIG_FILE_PATH), 'utf8', function(err, fileContent) {
            global.appConfig = JSON.parse(fileContent);
            global.appStartTime = (new Date).getTime();
            resolve();
        });
    });
};
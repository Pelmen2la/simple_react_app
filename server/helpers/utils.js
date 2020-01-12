const path = require('path');
const pug = require('pug');

module.exports = {
    sendPugTemplateResponse
};

async function sendPugTemplateResponse(res, templatePath, params = {}) {
    Object.assign(params, {
        appStartTime: global.appStartTime
    });
    const renderResult = pug.renderFile(path.join(global.appRoot, '/client/views/', templatePath + '.pug'), params);
    res.send(renderResult);
};
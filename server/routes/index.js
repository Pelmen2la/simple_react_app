const utils = require('./../helpers/utils');

module.exports = function(app) {
    require('./pages/products')(app);

    app.get('*', async function(req, res) {
        utils.sendPugTemplateResponse(res, '/main');
    });
};
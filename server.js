'use strict';

const express = require('express');
const path = require('path');
const app = express();

global.appRoot = path.resolve(__dirname);

process.on('uncaughtException', function(err) {
    console.error(err);
});

require('./server/config/index')(app).then(() => {
    require('./server/routes/index')(app);

    const server = app.listen(global.appConfig.appPort, '0.0.0.0', function() {
        console.log('App listening on port ' + server.address().port);
    });
});

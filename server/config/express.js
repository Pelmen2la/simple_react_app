const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cacheTime = 86400000 * 7; //7 days
const compression = require('compression');

module.exports = function(app) {
    app.use(compression({filter: shouldCompress}));
    app.use(express.static(path.join(global.appRoot, 'client'), {maxAge: cacheTime}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieSession({
        name: 'session',
        keys: [global.appConfig.sessionKey],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    app.use(bodyParser.json());
};

function shouldCompress(req, res) {
    if(req.headers['x-no-compression']) {
        return false
    }

    return compression.filter(req, res)
};
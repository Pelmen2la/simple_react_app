module.exports = function(app) {
    return new Promise(async(resolve) => {
        await require('./app-config')();

        require("./express")(app);
        resolve();
    });
};
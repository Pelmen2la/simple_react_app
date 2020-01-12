module.exports = {
    getUid,
    getRandomInt,
    getRandomFloat,
    getArrayAverage,
    getArrayRandom,
    spliceArrayRandom,
    flipCoin
};


function getUid() {
    function getPart() {
        var part = (Math.random() * 46656) | 0;
        return ("000" + part.toString(36)).slice(-3);
    }

    return getPart() + getPart();
};

function getRandomInt(min, max) {
    return Math.round(getRandomFloat(min, max));
};

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
};

function getArrayAverage(arr) {
    var sum = 0;
    arr.forEach((e) => sum += e);
    return arr.length ? sum / arr.length : 0;
};

function getArrayRandom(arr) {
    return arr[getRandomInt(0, arr.length - 1)];
};

function spliceArrayRandom(arr) {
    const res = [];
    arr.forEach(r => flipCoin() && res.push(r));
    return res;
};

function flipCoin() {
    return Math.random() >= 0.5;
};
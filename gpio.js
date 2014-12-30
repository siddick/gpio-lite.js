var gpio = module.exports,
    fs = require('fs'),
    _ = require('lodash'),
    gpioPath = '/sys/class/gpio/',
    exportPath = gpioPath + 'export',
    unexportPath = gpioPath + 'unexport',
    directionOut = 'out',
    directionIn = 'in',
    utf_8 = 'utf-8',
    pins = [],
    dirs = [];

_.extend(gpio, {
    get: function (pin, cb) {
        fs.readFile(pins[pin], utf_8, function (err, data) {
            cb(err, data && parseInt(data, 10));
        });
    },
    set: function (pin, val, cb) {
        fs.writeFile(pins[pin], val, cb);
    },
    out: function (pin, cb) {
        fs.writeFile(dirs[pin], directionOut, cb);
    },
    in: function (pin, cb) {
        fs.writeFile(dirs[pin], directionIn, cb);
    },
    export: function (pin, cb) {
        fs.exists(pins[pin], function (present) {
            present ? cb() : fs.writeFile(exportPath, pin, _.partial(setTimeout, cb, 100));
        });
    },
    unexport: function (pin, cb) {
        gpio.set(pin, 0, function (err) {
            err ? cb(err) : fs.writeFile(unexportPath, pin, cb);
        });
    },
    watch: function (pin, cb) {
        return fs.watch(pins[pin], cb);
    },
    pins: pins,
    dirs: dirs
});

_.times(30, function (pin) {
    pins[pin] = gpioPath + 'gpio' + pin + '/value';
    dirs[pin] = gpioPath + 'gpio' + pin + '/direction';
});

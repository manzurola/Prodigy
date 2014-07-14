/**
 * User: guyman
 * Date: 3/28/14
 * Time: 5:30 PM
 */

function log(msg, args) {
    console.log(msg);
    if (args && Array.isArray(args)) {
        for (var i = 0; i < args.length; i++) {
            console.log(args[i]);
        }
    } else if (args) {
        console.log(args);
    }
}

function Logger(context) {
    this.context = context;
    this.level = 5;

}
Logger.prototype = Object.create({});
Logger.prototype.constructor = Logger;
Logger.levels = [
    'ERROR',
    'WARN',
    'INFO',
    'DEBUG',
    'LOG'
];
Logger.level = 'LOG';
Logger.prototype.print = function (level, msg) {
    if (Logger.level <= level) {
        console.log('[' + level + ']@ ' + '[' + this.__context + ']# ' + msg);
    }
};
Logger.prototype.error = function (msg) {
    this.print(Logger.levels[0], msg);
};
Logger.prototype.warn = function (msg) {
    this.print(Logger.levels[1], msg);
};
Logger.prototype.info = function (msg) {
    this.print(Logger.levels[2], msg);
};
Logger.prototype.debug = function (msg) {
    this.print(Logger.levels[4], msg);
};
Logger.prototype.log = function (msg) {
    this.print(Logger.levels[5], msg);
};
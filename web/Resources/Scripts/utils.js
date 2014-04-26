/**
 * User: guyman
 * Date: 12/15/13
 * Time: 8:18 PM
 */

var Utils = (function () {

    function extend(obj, other) {
        for (var prop in other) {
            if (other.hasOwnProperty(prop)) {
                obj[prop] = obj[prop];
            }
        }
    }

    function getset(obj, other) {

        if (!obj.hasOwnProperty('__extensions')) {
            obj['__extensions'] = {};
        }
        for (var prop in other) {
            if (other.hasOwnProperty(prop)) {
                console.log(prop);
                obj[prop] = function (value) {
                    if (value) {
                        obj['__extensions'][prop] = value;
                        return obj;
                    } else {
                        return obj['__extensions'][prop];
                    }
                };
                obj[prop](other[prop]);
            }
        }
    }

    function assertArg(args, loc, type, values) {
        if (args.length < loc) {
            return false;
        }
        var obj = args[loc];
        if (typeof obj !== type) {
            return false;
        }
        if (typeof values === 'array' && values.length > 0) {
            return values.contains(obj);
        }
        return true;
    }

    return {
        extend:    extend,
        getset:    getset,
        assertArg: assertArg
    }
}());


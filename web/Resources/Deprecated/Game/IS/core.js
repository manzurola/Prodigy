/**
 * User: guyman
 * Date: 3/28/14
 * Time: 5:31 PM
 */
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function (parent) {
    this.prototype = new parent();
    var d = {},
        p = this.prototype;
    this.prototype.constructor = parent;
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    });
    return this;
});

function EXTEND(destination, source) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            destination[k] = source[k];
        }
    }
    return destination;
}

function INHERITS(child, parent) {
    child.prototype = Object.create(parent);
    child.prototype.constructor = parent;
}

function ASSERT_PROP(obj, prop, type) {
    if (obj instanceof Array) {
        if (obj.length <= prop) {
            throw 'out of bounds: array length ' + obj.length + ', index ' + prop;
        }
        if (typeof obj[prop] !== type) {
            return false;
        }
        return true;
    }

    return obj.hasOwnProperty(prop) && typeof obj[prop] === type;
}

function DEFINE_PROP(obj, prop, desc) {
    var defaults = {
            writable: true
        },
        settings = EXTEND(defaults, desc);


    Object.defineProperty(obj, prop, settings);
}

function DEFINE_PROP_MAP(obj, prop, src) {
    var defaults = {
            writable: true
        },
        settings = EXTEND(defaults, desc);
    DEFINE_PROP(obj, prop, {
        value: function() {
            if (arguments.length === 0) {
                return src;
            }

            var value = arguments[0];
            src = arguments
        }
    })
    Object.defineProperty(obj, prop, settings);
}

Array.prototype.shuffle = function () {
    var i = this.length, j, tempi, tempj;
    if (i === 0) {
        return this;
    }
    while (--i) {
        j = Math.floor(Math.random() * ( i + 1 ));
        tempi = this[i];
        tempj = this[j];
        this[i] = tempj;
        this[j] = tempi;
    }
    return this;
};

Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : undefined;
};

Array.prototype.contains = function (element) {
    return this.indexOf(element) !== -1 ? true : false;
};
Array.prototype.removeItem = function (item) {
    var i = this.indexOf(item);
    if (i !== -1) {
        this.splice(i, 1);
    }

    return i;
};
Array.prototype.removeAt = function (index) {
    if (index >= 0 && index < this.length) {
        removed = this[index];
        this.splice(index, 1);
        return true;
    } else {
        return false;
    }
};

function setObservableAttribute(obj, key, value) {
    var privateKeyName = '__' + key,
        getterSetterName = key;
    obj[privateKeyName] = value;

    obj[getterSetterName] = function (newVal) {
        if (newVal) {
            obj[privateKeyName] = newVal;
            return this;
        }

        return value;
    }
}

function mutateObservable(observer, subject, property, callback) {
    if (!observer.hasOwnProperty('observableRegistry')) {
        observer.observableRegistry = {};
    }
    if (!observer.observableRegistry.hasOwnProperty(subject)) {
        observer.observableRegistry[subject] = {};
    }
    if (!observer.observableRegistry[subject].hasOwnProperty(property)) {
        observer.observableRegistry[subject][property] = [];
    }
    observer.observableRegistry[subject][property].push(callback);
}

var Observable = (function () {

    var objectKeyCallbacks = {};

    function observe(obj) {
        obj.observe = function (key, callback) {
            if (!obj.hasOwnProperty(key)) {
                return this;
            }
            if (typeof callback != 'function') {
                return this;
            }
            if (!objectKeyCallbacks.hasOwnProperty(obj)) {
                objectKeyCallbacks[obj] = {};
            }
            if (!objectKeyCallbacks[obj].hasOwnProperty(key)) {
                objectKeyCallbacks[obj][key] = [];
            }

            objectKeyCallbacks[obj][key].push(callback);
            return this;
        };
    }

    return {
        observe: observe
    }
}());

var Visual = (function () {

    var objectElements;

    return {

    }
}());

var Prototypes = {};
Prototypes.PubSub = function () {
    this.registry = {};
    this.__observeables = {};
};
Prototypes.PubSub.prototype.fire = function (event) {
    // Fire an event on an object. The event can be either
    // a string containing the name of the event or an
    // object containing a type property containing the
    // name of the event. Handlers registered by the 'on'
    // method that match the event name will be invoked.
    console.log(this);
    var array, func, handler, i, type = typeof event === 'string' ? event : event.type;
    console.log('type: ' + type);
    // If an array of handlers exist for this event, then
    // loop through it and execute the handlers in order.

    if (this.registry.hasOwnProperty(type)) {
        array = this.registry[type];
        for (i = 0; i < array.length; i += 1) {
            handler = array[i];

            // A handler record contains a method and an optional
            // array of parameters. If the method is a name, look
            // up the function.

            func = handler.method;
            if (typeof func === 'string') {
                func = handler[func];
            }

            // Invoke a handler. If the record contained
            // parameters, then pass them. Otherwise, pass the
            // event object.

            func.apply(this, handler.parameters || [event]);
        }
    }
    return this;
};
Prototypes.PubSub.prototype.on = function (type, method, parameters) {
    // Register an event. Make a handler record. Put it
    // in a handler array, making one if it doesn't yet
    // exist for this type.
    var handler = {
        method:     method,
        parameters: parameters
    };
    if (this.registry.hasOwnProperty(type)) {
        this.registry[type].push(handler);
    } else {
        this.registry[type] = [handler];
    }
    return this;
};
Prototypes.PubSub.prototype.observe = function (type, method, parameters) {
    // Register an event. Make a handler record. Put it
    // in a handler array, making one if it doesn't yet
    // exist for this type.
    var handler = {
        method:     method,
        parameters: parameters
    };
    if (this.__observeables.hasOwnProperty(type)) {
        this.__observeables[type].push(handler);
    } else {
        this.__observeables[type] = [handler];
    }
    return this;
};
Prototypes.PubSub.prototype.notify = function (type) {
    // Fire an event on an object. The event can be either
    // a string containing the name of the event or an
    // object containing a type property containing the
    // name of the event. Handlers registered by the 'on'
    // method that match the event name will be invoked.
    console.log(this);
    var array, func, handler, i, type = typeof event === 'string' ? event : event.type;
    console.log('type: ' + type);
    // If an array of handlers exist for this event, then
    // loop through it and execute the handlers in order.

    if (this.__observeables.hasOwnProperty(type)) {
        array = this.__observeables[type];
        for (i = 0; i < array.length; i += 1) {
            handler = array[i];

            // A handler record contains a method and an optional
            // array of parameters. If the method is a name, look
            // up the function.

            func = handler.method;
            if (typeof func === 'string') {
                func = handler[func];
            }

            // Invoke a handler. If the record contained
            // parameters, then pass them. Otherwise, pass the
            // event object.

            func.apply(this, handler.parameters || [event]);
        }
    }
    return this;
};
Prototypes.PubSub.prototype.define = function (key, spec) {

    Object.defineProperty(this, key, {
        value:        spec.value,
        enumerable:   Assertions.isBoolean(spec.enumerable) ? spec.enumerable : false,
        configurable: Assertions.isBoolean(spec.configurable) ? spec.configurable : false,
        get:          function () {
            if (Assertions.isFunction(spec.get)) {
                return spec.get();
            }
            return this[key];
        },
        set:          function (value) {
            var oldValue = this[key];
            this[key] = value;
            if (oldValue !== value && spec.observeable) {
                this.notify(key);
            }
        }
    });
};
var Assertions = {
    isUndefined: function (obj) {

    },
    isFunction:  function (obj) {

    },
    isBoolean:   function (obj) {
        return typeof obj == 'boolean';
    }
};
/**
 * User: guyman
 * Date: 3/28/14
 * Time: 5:31 PM
 */

function Action(spec) {
    this.source = null;
    this.type = '';
    this.args = null;
    this.time = new Date().getTime();
    this.origEvent = null;
}

function defineProperty(obj, prop, desc) {
    Object.defineProperty(obj, prop, desc);
}

function extend(destination, source) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            destination[k] = source[k];
        }
    }
    return destination;
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

var Prototypes = {};
Prototypes.PubSub = function () {
    this.__registry = {};
};
Prototypes.PubSub.prototype.on = function (type, method, parameters) {
    var handler = {
        method:     method,
        parameters: parameters
    };

    if (!this.__registry.hasOwnProperty(type)) {
        this.__registry[type] = [];
    }

    this.__registry[type].push(handler);
    return this;
};
Prototypes.PubSub.prototype.fire = function (event) {
    var handlers, func, handler, i, type = typeof event === 'string' ? event : event.type;

    if (this.__registry.hasOwnProperty(type)) {
        handlers = this.__registry[type];

        for (i = 0; i < handlers.length; i += 1) {
            handler = handlers[i];
            func = handler.method;

            event.args = handler.parameters;
            event.source = this;

            log('firing event: ' + type + ', args: ' + event.args);
            func.apply(this, [event]);
        }
    }
    return this;
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

function HttpRequest() {
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.addEventListener("progress", this.__onProgress);
    this.xmlHttp.addEventListener("load", this.__onLoad);
    this.xmlHttp.addEventListener("error", this.__onError);
    this.xmlHttp.addEventListener("abort", this.__onAbort);
}

HttpRequest.prototype = Object.create({});

HttpRequest.prototype.constructor = HttpRequest;

extend(HttpRequest.prototype, Prototypes.PubSub);

HttpRequest.prototype.get = function(href, async) {
    this.xmlHttp.open('GET', href, true);
    this.xmlHttp.send();
};

HttpRequest.prototype.__onProgress = function(event) {
    this.fire('progress', event);
};

HttpRequest.prototype.__onLoad = function(event) {
    this.fire('load', event);
};

HttpRequest.prototype.__onError = function(event) {
    this.fire('error', event);
};

HttpRequest.prototype.__onAbort = function(event) {
    this.fire('abort', event);
};


function httpGet(href, cb, async) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.addEventListener("progress", this._updateProgress, async);
    xmlhttp.addEventListener("load", cb, async);
    xmlhttp.addEventListener("error", this._transferFailed, async);
    xmlhttp.addEventListener("abort", this._transferCanceled, async);

    xmlhttp.open('GET', href, true);
    xmlhttp.send();
}

function Remote() {

    /**
     * @private
     */
    this.get = function (href, cb, async) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("progress", this._updateProgress, async);
        xmlhttp.addEventListener("load", cb, async);
        xmlhttp.addEventListener("error", this._transferFailed, async);
        xmlhttp.addEventListener("abort", this._transferCanceled, async);

        xmlhttp.open('GET', href, true);
        xmlhttp.send();
    };

    // progress on transfers from the server to the client (downloads)
    this._updateProgress = function (oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total;
            log('progress: ' + percentComplete);
            // ...
        } else {
            // Unable to compute progress information since the total size is unknown
        }
    };

    this._transferComplete = function (evt) {
        logIt(evt);
        var xmlhttp = evt.target;
    };

    this._transferFailed = function (evt) {
        alert("An error occurred while transferring the file.");
    };

    this._transferCanceled = function (evt) {
        alert("The transfer has been canceled by the user.");
    };
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


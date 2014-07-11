/**
 * User: guyman
 * Date: 12/15/13
 * Time: 7:31 PM
 */
function Logger(context) {
    this.__context = context;
    this.levels = [
        'ERROR',
        'WARN',
        'INFO',
        'DEBUG',
        'LOG'
    ];
    this.__level = 0;
}
Logger.levels = [
    'ERROR',
    'WARN',
    'INFO',
    'DEBUG',
    'LOG'
];
Logger.__level = 'ERROR';
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

function DelayedTask(spec) {
    this.delay = sepc.delay;
    this.func = spec.func;
    this.parameters = spec.parameters;
}
DelayedTask.prototype.run = function () {

};
DelayedTask.prototype.cancel = function () {

};
function Entity(spec) {
    this.__registry = {};
    this.__data = {};
    this.state = {};
    this.__id = 0;
}
Entity.prototype = Object.create({});
Entity.prototype.constructor = Entity;
Entity.prototype.data = function (key, value) {
    if (arguments.length === 0) {
        return this.__data;
    }
    var args = arguments.slice(2);
    key = '' + key;
    if (args.length === 1) {
        return this.__data[key];
    }
    this.__data[key] = value;
    return this.__data;
};
Entity.prototype.state = function (key, value) {
    if (arguments.length === 0) {
        return this.state;
    }
    var args = arguments.slice(2);
    key = '' + key;
    if (args.length === 1) {
        return this.state[key];
    }
    this.state[key] = value;
    return this.state;
};
Entity.prototype.id = function (id) {
    if (typeof id === 'number') {
        this.__id = id;
        return this;
    } else {
        return this.__id;
    }
};
Entity.prototype.augment = function (obj) {
    Utils.extend(this, obj);
};
Entity.prototype.fire = function (event) {
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

    if (this.__registry.hasOwnProperty(type)) {
        array = this.prototype.__registry[type];
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
Entity.prototype.on = function (type, method, parameters) {

    // Register an event. Make a handler record. Put it
    // in a handler array, making one if it doesn't yet
    // exist for this type.

    var handler = {
        method:     method,
        parameters: parameters
    };
    if (this.__registry.hasOwnProperty(type)) {
        this.__registry[type].push(handler);
    } else {
        this.__registry[type] = [handler];
    }
    return this;
};

function Visual(elem, spec) {
    Entity.call(this, spec);
    this.__element = elem;
    this.state = this.__element.dataset;
    this.__children = [];
    this.__parent = null;

    this.__element.addEventListener('webkitAnimationEnd', _handleCorrectAnimationEndEvent);
}
Visual.prototype = Object.create(Entity.prototype);
Visual.prototype.constructor = Visual;
Visual.prototype.text = function (text) {
    if (text) {
        this.__element.innerText = '' + text;
        return this;
    } else {
        return this.__element.innerText;
    }
};
Visual.prototype.html = function (html) {
    if (html) {
        this.__element.innerHTML = html;
        return this;
    } else {
        return this.__element.innerHTML;
    }
};
Visual.prototype.decorate = function decorate(classes) {
    this.__element.classList.add(classes);
    return this;
};
Visual.prototype.strip = function strip(classes) {
    this.__element.classList.remove(classes);
    return this;
};
Visual.prototype.style = function (prop, value) {
    this.__element.style[prop] = value;
};
Visual.prototype.children = function () {
    return this.__children;
};
Visual.prototype.append = function (child) {
    this.__element.appendChild(child.element());
    this.__children.push(child);
    return this;
};
Visual.prototype.remove = function (child) {
    var indexOf = this.__children.indexOf(child);
    if (indexOf >= 0) {
        this.__element.removeChild(child.element());
        this.__children = this.__children.splice(indexOf, 1);
    }
    return this;
};
Visual.prototype.attach = function (parent) {
    parent.append(this);
    this.__parent = parent;
    return this;
};
Visual.prototype.detach = function () {
    if (this.__parent) {
        this.__parent.remove(this);
        this.__parent = null;
        return this;
    }
};
Visual.prototype.empty = function () {
    while (this.__children.length) {
        this.remove(this.__children[this.__children.length - 1]);
    }
    return this;
};
Visual.prototype.element = function () {
    return this.__element;
};
Visual.prototype.on = function (type, method, parameters) {
    switch (type.toLowerCase()) {
        case 'click':
            this.__element.addEventListener('click', function onclick(e) {
                e.target = this;
                this.fire(e);
            }, false);
            break;
        case 'mousedown':
            this.__element.addEventListener('mousedown', function onmousedown(e) {
                e.target = this;
                this.fire(e);
            }, false);
            break;
        case 'mouseup':
            this.__element.addEventListener('mouseup', function onmouseup(e) {
                e.target = this;
                this.fire(e);
            }, false);
            break;
        case 'animationend':
            this.__element.addEventListener('webkitAnimationEnd', function onanimationend(e) {
                e.target = this;
                this.fire(e);
            }, false);
            break;
    }
    Visual.prototype.on.call(this, type, method, parameters);
};
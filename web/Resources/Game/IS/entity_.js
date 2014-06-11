/**
 * User: guyman
 * Date: 4/30/14
 * Time: 11:24 PM
 */
function Entity(elem) {
    if (arguments.length > 0) {
        if (typeof elem === ' string') {
            this.element = document.createElement(elem);
        } else {
            this.element = elem;
        }
    }
    this.element.on('click', this.fire, 'select');
}
DEFINE_PROP(Entity.prototype, '__define', {
    writable: false,
    value:    function (prop, desc) {
        var defaults = {
                writable: false
            },
            settings = extend(defaults, desc);
        DEFINE_PROP(this, prop, desc);
        return this;
    }
});
Entity.prototype.registry = {};
Entity.prototype.elem = {};
Entity.prototype.style = {};
Entity.prototype.class =
Entity.prototype.define('__element', {
    value: null
});
Entity.prototype.define('__style', {
    value: {}
});
Entity.prototype.define('__data', {
    value: {}
});
Entity.prototype.define('__class', {
    get:      function () {
        return this.element.className;
    },
    set:      function (val) {
        this.element.className = val;
    },
    writable: true
});
Entity.prototype.define('__children', {
    enumerable: true,
    value:      [],
    get:        function () {
        return this.element.children;
    }
});
Entity.prototype.define('__parent', {
    writable: true,
    get:      function () {
        return this.element.parentNode;
    },
    set:      function (val) {
        this.element.parentNode = val;
    }
});
Entity.prototype.define('__text', {
    get: function () {
        return this.element.innerText;
    },
    set: function (val) {
        this.element.innerText = val;
    }
});
Entity.prototype.define('__html', {
    get: function () {
        return this.element.innerHTML;
    },
    set: function (val) {
        this.element.innerHTML = val;
    }
});
Entity.prototype.define('__addClass', {
    value: function (classes) {
        this.element.classList.add(classes);
        return this;
    }
});
Entity.prototype.define('__removeClass', {
    value: function (classes) {
        this.element.classList.remove(classes);
        return this;
    }
});
Entity.prototype.define('__style', {
    value: function () {
        if (arguments.length > 1)
            this.element.style[prop] = value;
    }
});
Entity.prototype.getStyle = function (prop) {
    return this.element.style[prop];
};
Entity.prototype.append = function (child) {
    this.element.appendChild(child.element);
    child.parent = this;
    this.children.push(child);
    return this;
};
Entity.prototype.appendTo = function (parent) {
    parent.append(this);
    this.parent = parent;
    return this;
};
Entity.prototype.remove = function (child) {
    var indexOf = this.children.indexOf(child);
    if (indexOf >= 0) {
        this.element.removeChild(child.element());
        this.children = this.children.splice(indexOf, 1);
    }
    return this;
};
Entity.prototype.attachTo = function (parent) {
    parent.append(this);
    this.parent = parent;
    return this;
};
Entity.prototype.detach = function () {
    if (this.parent) {
        this.parent.remove(this);
        this.parent = null;
        return this;
    }
};
Entity.prototype.empty = function () {
    while (this.children.length) {
        this.remove(this.children[this.children.length - 1]);
    }
    return this;
};
Entity.prototype.define('fire', {
    writable: false,
    value:    function fire(event) {
        // Fire an event on an object. The event can be either
        // a string containing the name of the event or an
        // object containing a type property containing the
        // name of the event. Handlers registered by the 'on'
        // method that match the event name will be invoked.
        console.log(this);
        var handlers, func, parameters, handler, i, type = (typeof event === 'string' ? event : event.type);
        console.log('firing key: ' + type);
        // If an array of handlers exist for this event, then
        // loop through it and execute the handlers in order.

        if (this.__registry.hasOwnProperty(type)) {
            handlers = this.__registry[type];
            for (i = 0; i < handlers.length; i += 1) {
                handler = handlers[i];

                // A handler record contains a method and an optional
                // array of parameters

                func = handler.method;

                // Invoke a handler. If the record contained
                // parameters, then pass them. Otherwise, pass the
                // event object.
                parameters = handler.parameters || this;
                func.apply(this, parameters);
            }
        }
        return this;
    }
});
Entity.prototype.define('on', {
    writable:     false,
    configurable: true,
    value:        function (type, method, parameters) {

        // Register an event. Make a handler record. Put it
        // in a handler array, making one if it doesn't yet
        // exist for this type.

        var handler = {
            method:     method,
            parameters: parameters
        };

        if (!this.__registry.hasOwnProperty(type)) {
            this.__registry[type] = [];
        }

        this.__registry[type].push(handler);
        return this;
    }
});



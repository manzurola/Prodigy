/**
 * User: guyman
 * Date: 12/15/13
 * Time: 7:31 PM
 */
function Entity(elem) {
    var element;
    if (elem) {
        if (typeof elem === ' string') {
            element = document.createElement(elem);
        } else if (elem instanceof Element) {
            element = elem;
        } else {
            throw 'unknown param elem';
        }

        for (var i=0; i<element.children.length; i++) {
            this.children.push(new Entity(element.children[i]));
        }

        this.__parent = element.parentNode;
        element.on('click', this.fire, 'select');
    }

    this.element = element;
    this.registry = {};
    this.data = {};
}

DEFINE_PROP(Entity.prototype, '__registry', {
    value: {}
});
DEFINE_PROP(Entity.prototype, '__element', {
    configurable: true,
    value: null
});
DEFINE_PROP(Entity.prototype, 'style', {
    value: function(key, val) {
        if (ASSERT_PROP(arguments, 0, 'string')) {
            if (ASSERT_PROP(arguments, 1)) {
                this.element.style[key] = value;
                return this;
            }
            return this.element.style[key];
        }
        throw 'invalid num of args, expected 2';
    }
});
DEFINE_PROP(Entity.prototype.style, 'getStyle', {
    value: function (key) {
        return this.element.style[key];
    }
});
DEFINE_PROP(Entity.prototype.style, 'set', {
    value: function key(key, value) {
        this.element.style[key] = value;
    }
});
DEFINE_PROP(Entity.prototype, 'data', {
    value: {}
});
DEFINE_PROP(Entity.prototype, 'class', {
    get:      function () {
        return this.element.className;
    },
    set:      function (val) {
        this.element.className = val;
    },
    writable: true
});
DEFINE_PROP(Entity.prototype, '__parent', {
    writable: true,
    value: null
});
DEFINE_PROP(Entity.prototype, 'parent', {
    writable: true,
    get: function() {
        return this.__parent;
    }
});
DEFINE_PROP(Entity.prototype, '__children', {
    enumerable: true,
    value:      [],
    get:        function () {
        return this.element.children;
    }
});
DEFINE_PROP(Entity.prototype, 'children', {});
DEFINE_PROP(Entity.prototype.children, '__parent', {
    writable: true,
    get:      function () {
        return this.element.parentNode;
    },
    set:      function (val) {
        this.element.parentNode = val;
    }
});
DEFINE_PROP(Entity.prototype, '__text', {
    get: function () {
        return this.element.innerText;
    },
    set: function (val) {
        this.element.innerText = val;
    }
});
DEFINE_PROP(Entity.prototype, '__html', {
    get: function () {
        return this.element.innerHTML;
    },
    set: function (val) {
        this.element.innerHTML = val;
    }
});
DEFINE_PROP(Entity.prototype, 'addClass', {
    value: function (classes) {
        this.element.classList.add(classes);
        return this;
    }
});
DEFINE_PROP(Entity.prototype, 'removeClass', {
    value: function (classes) {
        this.element.classList.remove(classes);
        return this;
    }
});

DEFINE_PROP(Entity.prototype, 'append', {
    value: function (child) {
        this.element.appendChild(child.element);
        child.parent = this;
        this.children.push(child);
        return this;
    }
});
DEFINE_PROP(Entity.prototype, 'appendTo', {
    value: function (parent) {
        parent.append(this);
        this.parent = parent;
        return this;
    }
});
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
DEFINE_PROP(Entity.prototype, 'fire', {
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
DEFINE_PROP(Entity.prototype, 'on', {
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

DEFINE_PROP = Entity.prototype.__define;


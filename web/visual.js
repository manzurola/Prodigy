/**
 * User: guyman
 * Date: 3/28/14
 * Time: 5:31 PM
 */

function Visual(elem) {
    if (arguments.length > 0) {
        if (typeof elem === ' string') {
            this.element = document.createElement(elem);
        } else {
            this.element = elem;
        }
    }
}
Visual.prototype = Object.create({});
Visual.prototype.constructor = Visual;
Visual.prototype.define('__registry', {});
Visual.prototype.define('element', null);
Visual.prototype.define('style', {});
Entity.prototype.define('data', {
    value: {},
    writable: false
});
Visual.prototype.define('class', {
    get: function() {
        return this.element.className;
    },
    set: function(val) {
        this.element.className = val;
    }
});
Visual.prototype.define('children', {
    writable: false,
    enumerable: true,
    value: [],
    get: function() {
        return this.element.children;
    }
});
Visual.prototype.define('parent', {
    writable: true,
    get: function() {
        return this.element.parentNode;
    },
    set: function(val) {
        this.element.parentNode = val;
    }
});
Visual.prototype.define('text', {
    get: function() {
        return this.element.innerText;
    },
    set: function(val) {
        this.element.innerText = val;
    }
});
Visual.prototype.define('html', {
    get: function() {
        return this.element.innerHTML;
    },
    set: function(val) {
        this.element.innerHTML = val;
    }
});
Visual.prototype.addClass = function (classes) {
    this.element.classList.add(classes);
    return this;
};
Visual.prototype.removeClass = function (classes) {
    this.element.classList.remove(classes);
    return this;
};
Visual.prototype.setStyle = function (prop, value) {
    this.element.style[prop] = value;
};
Visual.prototype.getStyle = function (prop) {
    return this.element.style[prop];
};
Visual.prototype.append = function (child) {
    this.element.appendChild(child.element());
    this.children.push(child);
    return this;
};
Visual.prototype.appendTo = function (parent) {
    this.element.parent.append(parent);
    return this;
};
Visual.prototype.remove = function (child) {
    var indexOf = this.children.indexOf(child);
    if (indexOf >= 0) {
        this.element.removeChild(child.element());
        this.children = this.children.splice(indexOf, 1);
    }
    return this;
};
Visual.prototype.attachTo = function (parent) {
    parent.append(this);
    this.parent = parent;
    return this;
};
Visual.prototype.detach = function () {
    if (this.parent) {
        this.parent.remove(this);
        this.parent = null;
        return this;
    }
};
Visual.prototype.empty = function () {
    while (this.children.length) {
        this.remove(this.children[this.children.length - 1]);
    }
    return this;
};
Visual.prototype.define('fire', {
    writable: false,
    value:     function fire(event) {
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
Visual.prototype.define('on', {
    writable: false,
    configurable: true,
    value:     function (type, method, parameters) {

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
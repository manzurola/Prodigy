/**
 * User: guyman
 * Date: 12/13/13
 * Time: 1:18 AM
 */

//
//function Entity(spec) {
//    console.log('Entity constructor');
//    var that = {},
//        registry = {},
//        data = {};
//    that.data = function (_data) {
//        if (!_data || typeof data !== 'object') {
//            return this;
//        }
//        for (var prop in _data) {
//            if (_data.hasOwnProperty(prop)) {
//                data[prop] = _data[prop];
//            }
//        }
//    };
//    that.fire = function (event) {
//        // Fire an event on an object. The event can be either
//        // a string containing the name of the event or an
//        // object containing a type property containing the
//        // name of the event. Handlers registered by the 'on'
//        // method that match the event name will be invoked.
//
//        var array, func, handler, i, type = typeof event === 'string' ? event : event.type;
//        console.log('type: ' + type);
//        // If an array of handlers exist for this event, then
//        // loop through it and execute the handlers in order.
//
//        if (this.registry.hasOwnProperty(type)) {
//            array = this.registry[type];
//            for (i = 0; i < array.length; i += 1) {
//                handler = array[i];
//
//                // A handler record contains a method and an optional
//                // array of parameters. If the method is a name, look
//                // up the function.
//
//                func = handler.method;
//                if (typeof func === 'instruction') {
//                    func = this.prototype[func];
//                }
//
//                // Invoke a handler. If the record contained
//                // parameters, then pass them. Otherwise, pass the
//                // event object.
//
//                func.apply(this.prototype,
//                    handler.parameters || [event]);
//            }
//        }
//        return this;
//    };
//    that.on = function (type, method, parameters) {
//
//        // Register an event. Make a handler record. Put it
//        // in a handler array, making one if it doesn't yet
//        // exist for this type.
//
//        var handler = {
//            method:     method,
//            parameters: parameters
//        };
//        if (this.registry.hasOwnProperty(type)) {
//            this.registry[type].push(handler);
//        } else {
//            this.registry[type] = [handler];
//        }
//        return this;
//    };
//    return that;
//}

function Visual(spec) {
    var that = Entity(spec),
        element = spec.element,
        children = [],
        parent = {};
    that.text = function (_text) {
        if (_text) {
            element.innerText = text;
            return this;
        } else {
            return element.innerText;
        }
    };
    that.html = function (_html) {
        if (_html) {
            element.innerHTML = _html;
            return this;
        } else {
            return element.innerHTML;
        }
    };
    that.decorate = function decorate(classes) {
        element.classList.add(classes);
        this.fire('decorate');
        return this;
    };
    that.strip = function strip(classes) {
        element.classList.remove(classes);
        return this;
    };
    that.style = function (_prop, _value) {
        element.style[_prop] = _value;
    };
    that.children = function () {
        return children;
    };
    that.append = function (child) {
        element.appendChild(child.element());
        children.push(child);
        return this;
    };
    that.remove = function (_child) {
        var indexOf = children.indexOf(_child);
        if (indexOf >= 0) {
            element.removeChild(_child.element());
            children = children.splice(i, 1);
        }
        return this;
    };
    that.attach = function (_parent) {
        this.detach();
        _parent.append(this);
        parent = _parent;
        return this;
    };
    that.detach = function () {
        if (parent) {
            parent.remove(this);
            return this;
        }
    };
    that.element = function () {
        return element;
    };
    return that.decorate('visual');
}

//function Visual(spec) {
//    console.log('Visual constructor');
//    var element = {};
//    var children = [];
//    var parent = {};
//    Entity.call(this, spec);
//    element.className = 'visual';
//
//    this.decorate = function decorate(classes) {
//        element.classList.add(classes);
//        console.log('decorate');
//        this.fire('decorate');
//        return this;
//    };
//    this.strip = function strip(classes) {
//        element.classList.remove(classes);
//        return this;
//    };
//    this.append = function (child) {
//        if (!(child instanceof Visual)) {
//            return;
//        }
//        element.appendChild(child.element);
//        this.children.push(child);
//        return this;
//    };
//    this.appendTo = function (parent) {
//        if (!(parent instanceof Visual)) {
//            return;
//        }
//        parent.append(this);
//        parent = parent;
//        return this;
//    };
//}
//Visual.swiss(Entity);
//Visual.prototype.decorate = function decorate(classes) {
//    this.element.classList.add(classes);
//    console.log('decorate');
//    console.log(this);
//    this.fire('decorate');
//    return this;
//};
//Visual.prototype.strip = function strip(classes) {
//    this.element.classList.remove(classes);
//    console.log('strip');
//    return this;
//};
//Visual.prototype.append = function (child) {
//    if (!(child instanceof Visual)) {
//        return;
//    }
//    this.element.appendChild(child.element);
//    this.children.push(child);
//    return this;
//};
//Visual.prototype.appendTo = function (parent) {
//    if (!(parent instanceof Visual)) {
//        return;
//    }
//    parent.append(this);
//    this.parent = parent;
//    return this;
//};

//function Visual(spec) {
//    this.element = {};
//    Entity.call(this, spec);
//    this.element.className = 'visual';
//    this.__children__ = [];
//    this.__parent__ = {};
//}
//Visual.prototype = Object.create(Entity, {
//    decorate:     {
//        value: function decorate(classes) {
//            this.element.classList.add(classes);
//            console.log('decorate');
//            console.log(this);
//            this.fire('decorate');
//            return this;
//        }
//    },
//    strip:        {
//        value: function strip(classes) {
//            this.element.classList.remove(classes);
//            console.log('strip');
//            return this;
//        }
//    },
//    children:     {
//        get: function () {
//            return this.__children__;
//        }
//    },
//    parent:       {
//        get: function () {
//            return this.__parent__;
//        }
//    },
//    append:       {
//        value: function (child) {
//            if (!(child instanceof Visual)) {
//                return;
//            }
//            this.element.appendChild(child.element);
//            this.__children__.push(child);
//        }
//    },
//    appendTo:     {
//        value: function (parent) {
//            if (!(parent instanceof Visual)) {
//                return;
//            }
//            parent.append(this);
//            this.__parent__ = parent;
//        }
//    }
//});
Visual.pubsub();

function BoxedVisual(element, spec) {
    Visual.call(this, element, spec);
}

BoxedVisual.prototype = Object.create(Visual.prototype, {
    sayHello: {
        value: function () {
            console.log('BoxedVisual hello');
            console.log(this.element);
            return this;
        }
    }
});

function ProgressBar(spec) {
    var that = Visual(spec).decorate('progressbar'),
        progress = spec.progress ? spec.progress : 0,
        inner = Visual({
            element: document.createElement('div')
        }).decorate('progressbar-inner')
            .style('width', progress + '%')
            .appendTo(that);
    that.progress = function (_progress) {
        if (_progress) {
            progress = _progress;
            inner.style('width', progress + '%');
            return this;
        } else {
            return progress;
        }
    };
    return that;
}

//function ProgressBar(element, spec) {
//    Visual.call(this, element, spec);
//    this.__inner__ = document.createElement('div');
//    this.__inner__.className = 'progressbar-inner';
//}
//ProgressBar.prototype = Object.create(Visual, {
//    __inner__:    {
//        value: {}
//    },
//    __progress__: {
//        value: 0
//    },
//    progress:     {
//        get: function () {
//            console.log('get progress');
//            return this.__progress__;
//        },
//        set: function (value) {
//            if (typeof (value) !== 'number') {
//                return;
//            }
//            if (value > 100) {
//                value = 100;
//            } else if (value < 0) {
//                value = 0;
//            }
//            this.__inner__.style.width = value + '%';
//            this.__progress__ = value;
//        }
//    },
//    init:         {
//        value:    function init() {
//            this.__inner__ = document.createElement('div');
//            this.__inner__.className = 'progressbar-inner';
//            this.__inner__.style.width = this.value + '%';
//
//            this.decorate('progressbar');
//            this._element_.appendChild(this.__inner__);
//            console.log(this);
//            console.log('ProgressBar init');
//            return this;
//        },
//        writable: true
//    }
//});

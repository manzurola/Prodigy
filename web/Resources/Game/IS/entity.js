/**
 * User: guyman
 * Date: 12/15/13
 * Time: 7:31 PM
 */
function Entity(elem) {
    this.visual = new Visual(elem).on('click', this.fire, 'select');
}
Entity.prototype = Object.create({});
Entity.prototype.constructor = Entity;
Entity.prototype.define = function (prop, desc) {
    if (desc !== 'object') {
        var value = desc;
        var mod = {
            value: value,
            writable: true
        };
        defineProperty(this, prop, mod);
        return this;
    }

    defineProperty(this, prop, desc);
    return this;
};
Entity.prototype.define('__registry', {});
Entity.prototype.define('visual', null);
Entity.prototype.define('fire', {
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
Entity.prototype.define('on', {
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

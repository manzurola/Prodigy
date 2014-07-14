/**
 * User: guyman
 * Date: 3/28/14
 * Time: 5:31 PM
 */

function Entity(elem) {
    if (typeof elem === 'string') {
        this.__element = document.createElement(elem);
    } else {
        this.__element = elem;
    }
    this.__registry = {};
    this.__data = {};
    this.__isDisabled = false;
}
Entity.prototype = Object.create({});
Entity.getEntityById = function (id) {
    var elem = document.getElementById(id);

    return new Entity(elem);
};
Entity.prototype.constructor = Entity;
Entity.prototype.on = function (type, method, parameters) {
    var handler = {
        method:     method,
        parameters: parameters
    }, domEventName;

    // register a new event with the dom element
    if (!this.__registry.hasOwnProperty(type)) {
        this.__registry[type] = [];
        domEventName = Entity.translateToDomEventName(type);
        if (domEventName) {
            this.__element.addEventListener(domEventName, this.fire.bind(this, type));
        }
    }

    // add a unique handler for the event
    if (!this.__registry[type].contains(handler)) {
        this.__registry[type].push(handler);
    }
    return this;
};
Entity.prototype.fire = function (event) {
    log(event);
    var handlers, func, handler, i, type = typeof event === 'string' ? event : event.type;

    if (this.__isDisabled) {
        log('disabled. not firing events');
        return;
    }

    if (this.__registry.hasOwnProperty(type)) {
        handlers = this.__registry[type];

        for (i = 0; i < handlers.length; i += 1) {
            handler = handlers[i];
            func = handler.method;

            //            event.args = handler.parameters;
            //            event.source = this;

            log('firing event: ' + type + ', args: ' + event.args);
            func.apply(this, [this]);
        }
    }
    return this;
};
Entity.prototype.off = function (type, method) {
    var handler = {
        method:     method,
        parameters: parameters
    };

    if (this.__registry.hasOwnProperty(type)) {
        this.__registry[type].removeItem(method);
        this.__element.removeEventListener(type, this.fire.bind(this));   //one time per event type
    }

    return this;
};
Entity.prototype.getData = function (key) {
    return this.__data[key];
};
Entity.prototype.setData = function (key, val) {
    this[key] = val;
    return this;
};
Entity.prototype.getText = function () {
    return this.__element.innerText;
};
Entity.prototype.setText = function (text) {
    this.__element.innerText = text;
    return this;
};
Entity.prototype.getHtml = function () {
    return this.__element.innerHTML;
};
Entity.prototype.setHtml = function (html) {
    this.__element.innerHTML = html;
    return this;
};
Entity.prototype.setStyle = function (prop, value) {
    this.__element.style[prop] = value;
    return this;
};
Entity.prototype.getStyle = function (prop) {
    return this.__element.style[prop];
};
Entity.prototype.getChildren = function () {
    var children = [];
    for (var i = 0; i < this.__element.children.length; i++) {
        children.push(new Entity(this.__element.children[i]));
    }
    return children;
};
Entity.prototype.appendChild = function (child) {
    this.__element.appendChild(child.__element);
    return this;
};
Entity.prototype.appendChildren = function (children) {
    for (var i = 0; i < children.length; i++) {
        this.__element.appendChild(children[i]);
    }
    return this;
};
Entity.prototype.removeChild = function (child) {
    this.__element.removeChild(child.__element);
    return this;
};
Entity.prototype.removeChildren = function (children) {
    for (var i = 0; i < children.length; i++) {
        this.__element.removeChild(children[i]);
    }
    return this;
};
Entity.prototype.replaceChild = function (newChild, oldChild) {
    log('new child: ');
    log(newChild);
    log('old child: ' + oldChild);
    log(oldChild);
    this.__element.replaceChild(newChild.__element, oldChild.__element);
    return this;
};
Entity.prototype.appendTo = function (parent) {
    parent.__element.appendChild(this.__element);
    return this;
};
Entity.prototype.remove = function () {
    this.__element.parentNode.removeChild(this.__element);
    return this;
};
Entity.prototype.empty = function () {
    while (this.__element.hasChildNodes()) {
        this.__element.removeChild(this.__element.lastChild);
    }
    return this;
};
Entity.prototype.getElement = function () {
    return this.__element;
};
Entity.prototype.getEntitiesByClassName = function (name) {
    var elements = this.__element.getElementsByClassName(name),
        entities = [];
    for (var i = 0; i < elements.length; i++) {
        entities.push(new Entity(elements[i]));
    }
    return entities;
};
Entity.prototype.clone = function (deep) {
    var deepClone = deep ? true : false;
    log(this.constructor);
    var clone = new this.constructor(this.__element.cloneNode(deepClone));
    log('clone called on: ', [this]);
    for (var prop in this) {
        if (this.hasOwnProperty(prop) && prop !== '__element') {
            if (prop.hasOwnProperty('__element')) {
                log ('cloning entity prop', this[prop]);
                clone[prop] = this[prop].clone(deepClone);
            }
            else if (prop !== '__element') {
                clone[prop] = this[prop];
            }
        }
    }
    return clone;
};
Entity.prototype.replace = function (other) {
    this.getParent().replaceChild(other, this);
    return this;
};
Entity.prototype.getParent = function () {
    return new Entity(this.__element.parentNode);
};
Entity.prototype.getClassName = function () {
    return this.__element.className;
};
Entity.prototype.setClassName = function (name) {
    this.__element.className = name;
    return this;
};
Entity.prototype.addClasses = function (classes) {
    this.__element.classList.add(classes);
    return this;
};
Entity.prototype.removeClasses = function (classes) {
    this.__element.classList.remove(classes);
    return this;
};
Entity.prototype.disable = function () {
    this.__isDisabled = true;
    return this;
};
Entity.prototype.enable = function () {
    this.__isDisabled = false;
    return this;
};
Entity.prototype.show = function () {
    this.__element.style.visibility = 'visible';
    return this;
};
Entity.prototype.hide = function () {
    this.__element.style.visibility = 'hidden';
    return this;
};

Entity.presets = {};
Entity.presets['default'] = function () {

};
Entity.presets['button'] = function (elem) {
    var entity = new Entity(elem);
    entity.setClassName('button');
    entity.on('click', function (e) {
        e.type = 'submit';
        entity.fire('submit');
    });
    return entity;
};
Entity.presets['list'] = function (elem) {
    var entity = new Entity(elem);
    entity.setClassName('list');

    return entity;
};
Entity.translateDomToEntityEvent = function (src) {
    switch (src) {
        case 'animationend':
            return ['webkitAnimationEnd'];
            break;
        case 'click':
            return ['click'];
            break;
        default:
            return [src];
    }
};
Entity.translateToDomEventName = function (src) {
    switch (src) {
        case 'animationEnd':
            return 'webkitAnimationEnd';
            break;
        case 'click':
            return 'click';
            break;
        default:
            return src;
    }
};
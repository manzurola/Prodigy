/**
 * Created with IntelliJ IDEA.
 * User: guy
 * Date: 4/24/13
 * Time: 1:45 PM
 * To change this template use File | Settings | File Templates.
 */

var ERRORS = {
    NOT_IMPLEMENTED: 'method not implemented'
};

Array.prototype.shuffle = function () {
    var i = this.length, j, tempi, tempj;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * ( i + 1 ));
        tempi = this[i];
        tempj = this[j];
        this[i] = tempj;
        this[j] = tempi;
    }
    return this;
};

Array.prototype.clone = function () {
    return this.slice(0);
};

var prodigyScreen = function (view) {

    var CSS_CLASS_NAMES = {
        SCREEN: 'screen'
    };

    var that = {};

    var eventRegistry = {};


    (function () {
        view.className = CSS_CLASS_NAMES.SCREEN;
    }());

    that.fireEvent = function (event) {

        var array, func, parameters, handler, type;
        type = typeof event === 'string' ? event : event.type;

        if (eventRegistry.hasOwnProperty(type)) {
            array = eventRegistry[type];
            for (var i = 0; i < array.length; i++) {
                handler = array[i];
                func = handler.method;
                parameters = handler.parameters || this;
                func.apply(this, parameters);
            }
        }
        return this;
    };

    that.show = function () {
        view.style.display = 'block';
        that.fireEvent('show');
        return this;
    };

    that.hide = function () {
        view.style.display = 'none';
        that.fireEvent('hide');
        return this;
    };

    that.refresh = function () {
        return this;
    };

    that.on = function (type, method, parameters) {
        var handler = {
            method    : method,
            parameters: parameters
        };
        if (eventRegistry.hasOwnProperty(type)) {
            eventRegistry[type].push(handler);
        } else {
            eventRegistry[type] = [handler];
        }
        return this;
    };

    return that;
};

var prodigyScreenCode = {
    HOME            : 0,
    SUBJECT_SELECT  : 1,
    EXERCISE_SELECT : 2,
    GAME            : 3,
    EXERCISE_FAILED : 4,
    EXERCISE_CLEARED: 5,
    PAUSED          : 6
};

var entity = function (view, data) {

    var that = {};

    var eventRegistry = {},
        isShowing = true,
        originalDisplayStyle = view && view.hasOwnProperty('style') ? view.style.display : null,
        parentNode = view && view.hasOwnProperty('parentNode') ? view.parentNode : null;

    (function () {

        if (view) {
            _enableSelectEvents();
//            view.addEventListener('click', function (e) {
//                e.stopPropagation();
//                that.fireEvent('select');   //  abstract the click as a select event
//            }, false);
        }
    }());

    that.fireEvent = function (event) {

        var array, func, parameters, handler, type;
        type = typeof event === 'string' ? event : event.type;

        if (eventRegistry.hasOwnProperty(type)) {
            array = eventRegistry[type];
            for (var i = 0; i < array.length; i++) {
                handler = array[i];
                func = handler.method;
                parameters = handler.parameters || this;
                func.apply(this, [parameters]);
            }
        }
        return this;
    };

    that.setInnerText = function (content) {
        view.innerText = '' + content;
        return this;
    };

    that.getInnerText = function () {
        return view.innerText;
    };

    that.getView = function () {
        return view;
    };

    /**
     * Enable publication of click events as an abstract 'select' event
     */
    that.enableSelectEvents = function(){
        _enableSelectEvents();
        return this;
    };

    /**
     * Disable publication of 'select' event
     */
    that.disableSelectEvents = function(){
        logIt('disabling select events');
        _disableSelectEvents();
        return this;
    };

    that.show = function () {
        if (!isShowing) {
            view.style.display = originalDisplayStyle;
            isShowing = true;
        }
        return this;
    };

    that.hide = function () {
        if (isShowing) {
            view.style.display = 'none';
            isShowing = false;
        }
        return this;
    };

    that.remove = function () {
        if (parentNode) {
            parentNode.removeChild(view);
            parentNode = null;
        }
        return this;
    };

    that.appendTo = function (parent) {
        parentNode = parent.getView();
        parentNode.appendChild(view);
        return this;
    };

    that.isShowing = function () {
        return _isDrawn();
    };

    that.on = function (type, method, parameters) {
        var handler = {
            method    : method,
            parameters: parameters
        };
        if (eventRegistry.hasOwnProperty(type)) {
            eventRegistry[type].push(handler);
        } else {
            eventRegistry[type] = [handler];
        }
        return this;
    };

    that.getData = function () {
        return data;
    };

    /**
     * Overwrites any existing properties this entity's data holds with those supplied in other.
     * Non existing properties will not be considered.
     * @param other
     * @return {*}
     */
    that.setData = function (other) {
        for (var prop in other) {
            if (other.hasOwnProperty(prop) && data.hasOwnProperty(prop)) {
                data[prop] = other[prop];
            }
        }
        return this;
    };

    function _isDrawn() {
        return view.style.display !== 'none';
    }

    function _enableSelectEvents(){

        //  allow only a single event listener for a click event
        view.onclick = _onClick;
    }

    function _disableSelectEvents(){
        view.onclick = null;
    }

    function _onClick(event) {
        event.stopPropagation();
        that.fireEvent('select');   //  abstract the click as a select event
    }

    return that;
};


//var welcomeScreen = function(view){
//
//    var that = prodigyScreen(view);
//
//    function _start(){
//        that.fireEvent('start');
//    }
//
//    (function(){
//        var _startButton = document.getElementById('btnStart');
//        _startButton.addEventListener('click', _start);
//    }());
//
//    return that;
//};


//// JavaScript Document
//
var welcomeScreen = function(view, spec){

    var CSS_CLASS_NAMES = {
        SELF: 'welcome screen',
        TITLE : 'title',
        SLOGAN : 'slogan question'
    };

    var that = entity(view, spec);

    var multiChoiceStart,
        title,
        slogan;

    (function() {
        view.className = CSS_CLASS_NAMES.SELF;
        title = _createAndAppendTitle('pr<span class="blank"><span class="star"></span></span>digy');
        slogan = _createAndAppendSlogan('Power Up Your Grammar');
        multiChoiceStart = _createAndAppendStartButton();
    }());

    function _start(){
        multiChoiceStart.toggleState(multiChoiceStart.states().CORRECT);
        setTimeout(function(){
            that.fireEvent('start');
        }, 450);
    }

    function _createAndAppendStartButton(){
        var startView = document.createElement('span');
        view.appendChild(startView);
        var _answer = answer(document.createElement('span'), {'token' : "start", 'isCorrect' : true});
        return multiChoice(startView, {'answer': _answer})
            .on('select', _start);
    }

    function _createAndAppendTitle(text){
        var titleView = document.createElement('span');
        titleView.innerHTML = text;
        titleView.className = CSS_CLASS_NAMES.TITLE;
        titleView.appendChild(document.createElement('br'));
        view.appendChild(titleView);
        return entity(titleView, {});
    }

    function _createAndAppendSlogan(text){
        var sloganView = document.createElement('span');
        sloganView.innerHTML = text;
        sloganView.className = CSS_CLASS_NAMES.SLOGAN;
        sloganView.appendChild(document.createElement('br'));
        view.appendChild(sloganView);
        return entity(sloganView, {});
    }

    return that;
};
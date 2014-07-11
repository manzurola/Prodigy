var pausedGameScreen = function(view, spec){

    var that = entity(view, spec);

    function _resume(){
        that.fireEvent('resume');
    }

    function _restart(){
        that.fireEvent('restart');
    }

    function _quit(){
        that.fireEvent('quit');
    }

    (function(){
        var _resumeButton = document.getElementById('pausedScreen_resume');
        _resumeButton.addEventListener('click', _resume);

        var _restartButton = document.getElementById('pausedScreen_restart');
        _restartButton.addEventListener('click', _restart);

        var _quitButton = document.getElementById('pausedScreen_quit');
        _quitButton.addEventListener('click', _quit);

    }());

    return that;
};

var exerciseFailedScreen = function(view, spec){

    var CHILD_IDS = {
        RESTART_BUTTON : 'exerciseFailedScreen-restartButton',
        QUIT_BUTTON : 'exerciseFailedScreen-quitButton'
    };

    var that = entity(view, spec);

    /*  INIT */
    (function(){

        //  create restart button
        var restartButton = document.getElementById(CHILD_IDS.RESTART_BUTTON);
        restartButton.addEventListener('click', _restart);

        //  create quit button
        var quitButton =  document.getElementById(CHILD_IDS.QUIT_BUTTON);
        quitButton.addEventListener('click', _quit);

    }());

    function _restart(){
        that.fireEvent('restart');
    }

    function _quit(){
        that.fireEvent('quit');
    }

    return that;
};

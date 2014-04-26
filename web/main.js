//	Screen Manager is responsible for transitioning between different screens in web site
//	the screens are:
//	Main - entry point
//	Subject Selection - selecting subjects
//	Exercise Selection - selecting exercises relevant to selected subject
//	Game - playing an exercise
//	each screen is contained in its own HTML page and developed seperately from others
//	This class is then responsible for fetching, caching and transistioning between multiple screens
//	a few things that should be considered:
//	1.	after a screen is fetched it should be cached
//	2.	trasition between screens should be animated
//	3.	client side data stroage should be used to maintatin current screen
//	4.	html5 Histroy api should be used to allow back tracking using the browsers back button


window.onload = function (e) {
    logIt("main.js onload fired");
    MAIN.init();
};

var MAIN = (function () {

    var _activeStateModule = null;
    var _screens = {};
    var prodigy;

    function _init() {
        prodigy = entity(document.getElementById('prodigy'), {});
        _screens = {
            welcome          : welcomeScreen(document.createElement('div'), {}).appendTo(prodigy),
            subjectSelection : subjectSelectionScreen(document.getElementById('subjects')).remove(),
            exerciseSelection: exerciseSelectionScreen(document.getElementById('exercises')).remove(),
            activeGame       : game(document.getElementById('game')).remove(),
            pausedGame       : pausedGameScreen(document.getElementById('pausedScreen')).remove(),
            exerciseFailed   : exerciseFailedScreen(document.getElementById('exerciseFailedScreen')).remove(),
            exerciseCleared  : exerciseClearedScreen(document.getElementById('exerciseClearedScreen')).remove()
        };

        //  configure pub-sub module communication
        _screens.welcome.on('start', _handleWelcomeScreenStartEvent);

        _screens.subjectSelection.on('subjectSelected', _handleSubjectSelectedEvent)
            .on('back', _handleSubjectSelectionBackButtonPressEvent);

        _screens.exerciseSelection.on('exerciseSelected', _handleExerciseSelectedEvent)
            .on('back', _handleExerciseSelectionBackButtonPressEvent);

        _screens.activeGame.on('exerciseCleared',_handleExerciseClearedEvent)
            .on('exerciseFailed', _handleExerciseFailedEvent)
            .on('pause', _handleGamePauseEvent);

        _screens.pausedGame.on('resume', _handlePausedScreenResumeEvent)
            .on('restart', _handlePausedScreenRestartEvent)
            .on('quit', _handlePausedScreenQuitEvent);

        _screens.exerciseFailed.on('restart',_handleExerciseFailedScreenRestartEvent)
            .on('quit', _handleExerciseFailedScreenQuitEvent);

        _screens.exerciseCleared.on('restart',_handleExerciseClearedScreenRestartEvent)
            .on('quit', _handleExerciseClearedScreenQuitEvent)
            .on('newTopScore', function (screen) {

            });

        _activeStateModule = _screens.welcome.show();

        _loadTestFrame();
        _registerFrameMessage();
    }

    function _handleWelcomeScreenStartEvent(){
        _screens.welcome.remove();
        _screens.subjectSelection.appendTo(prodigy).loadSubjects();
    }

    function _handleSubjectSelectionBackButtonPressEvent(){
        _screens.subjectSelection.remove();
        _screens.welcome.appendTo(prodigy);
    }

    function _handleSubjectSelectedEvent(){
        _screens.subjectSelection.remove();
        var selectedSubject = _screens.subjectSelection.getSelectedSubject();
        _screens.exerciseSelection.appendTo(prodigy).loadExercisesBySubject(selectedSubject);
    }

    /**
     * Starts a new game with exercise selected at exerciseSelectionScreen
     * @private
     */
    function _handleExerciseSelectedEvent(exerciseSelectionScreen){
        _screens.exerciseSelection.remove();
        _screens.activeGame.initExercise(exerciseSelectionScreen.getSelectedExercise())
            .appendTo(prodigy)
            .start();
    }

    function _handleExerciseSelectionBackButtonPressEvent(){
        _screens.exerciseSelection.remove();
        _screens.subjectSelection.appendTo(prodigy).loadSubjects();
    }

    function _handlePausedScreenQuitEvent(){
        _screens.pausedGame.remove();
        _screens.activeGame.quit().remove();
        _screens.exerciseSelection.appendTo(prodigy);
    }

    function _handleGamePauseEvent(){
        _screens.pausedGame.appendTo(prodigy);
    }

    function _handlePausedScreenResumeEvent(){
        _screens.pausedGame.remove();
        _screens.activeGame.resume();
    }

    function _handlePausedScreenRestartEvent(){
        _screens.pausedGame.remove();
        _screens.activeGame.restart();
    }

    function _handleExerciseClearedEvent(){
        //  get stats from game screen
        _activeStateModule = _screens.exerciseCleared
            .appendTo(prodigy)
            .setGrade(_screens.activeGame.getGrade());
    }

    function _handleExerciseFailedEvent(){
        //  do not hide active game screen
        _activeStateModule = _screens.exerciseFailed.appendTo(prodigy);
    }

    function _handleExerciseFailedScreenRestartEvent(){
        _screens.exerciseFailed.remove();
        _screens.activeGame.restart();
    }

    function _handleExerciseFailedScreenQuitEvent(){
        _screens.exerciseFailed.remove();
        _screens.activeGame.quit().remove();
        _screens.exerciseSelection.appendTo(prodigy);
    }

    function _handleExerciseClearedScreenRestartEvent(){
        _screens.exerciseCleared.remove();
        _screens.activeGame.appendTo(prodigy).restart();
    }

    function _handleExerciseClearedScreenQuitEvent(){
        _screens.exerciseCleared.remove();
        _screens.activeGame.quit().remove();
        _screens.exerciseSelection.appendTo(prodigy);
    }

    function _registerFrameMessage() {
        window.addEventListener("message", function(e){
            logIt("message received from frame: ");
            logIt(e.data);
            logIt(e.origin);
            logIt(e.source);
        }, false);
    }

    function _loadTestFrame() {
        APPLICATION.do();
        document.getElementById("frame").src = "testScreen.html";
    }

    return {
        //	loads the last active screen. Either defaults to main, or fetched from session data
        init: function () {
            _init();
        }
    }
})();
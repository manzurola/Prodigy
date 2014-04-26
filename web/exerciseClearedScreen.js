var exerciseClearedScreen = function (view, spec) {

    var CHILD_IDS = {
        STARS_COLLECTED: 'exerciseClearedScreen-starsCollected',
        STARS_TOTAL    : 'exerciseClearedScreen-totalStars',
        TOTAL_SCORE    : 'exerciseClearedScreen-totalScore',
        GRADE          : 'exerciseClearedScreen-grade',
        RESTART_BUTTON : 'exerciseClearedScreen-restartButton',
        QUIT_BUTTON    : 'exerciseClearedScreen-quitButton'
    };

    var that = entity(view, spec);

    var gameScore,
        accuracyBonus,
        timeBonus,
        totalScore;

    /*  build initial view elements */
    (function () {

        //  restart button
        var restartButton = document.getElementById(CHILD_IDS.RESTART_BUTTON);
        restartButton.addEventListener('click', _restart);

        //  quit button
        var quitButton = document.getElementById(CHILD_IDS.QUIT_BUTTON);
        quitButton.addEventListener('click', _quit);
    }());

    that.setStarsCollected = function (collected, total) {
        document.getElementById(CHILD_IDS.STARS_COLLECTED).innerHTML = collected;
        document.getElementById(CHILD_IDS.STARS_TOTAL).innerHTML = total;
        return this;
    };

    that.setGrade = function (percent) {
        document.getElementById(CHILD_IDS.GRADE).innerHTML = percent;
        return this;
    };

    that.setTotalScore = function (score) {
        document.getElementById(CHILD_IDS.TOTAL_SCORE).innerHTML = score;
        return this;
    };

    that.setStats = function (stats) {
        gameScore = stats['gameScore'];
        accuracyBonus = stats['accuracyBonus'];
        timeBonus = stats['timeBonus'];
        totalScore = stats['totalScore'];

        document.getElementById(CHILD_IDS.GAME_SCORE).innerHTML = gameScore;
        document.getElementById(CHILD_IDS.ACCURACY_BONUS).innerHTML = accuracyBonus;
        document.getElementById(CHILD_IDS.TOTAL_SCORE).innerHTML = totalScore;
        document.getElementById(CHILD_IDS.TOTAL_SCORE).innerHTML = totalScore;

        return this;
    };

    that.setGameScore = function (points) {
        gameScore = points;
        document.getElementById(CHILD_IDS.GAME_SCORE).innerHTML = gameScore;
        return this;
    };

    that.setAccuracyBonus = function (points) {
        accuracyBonus = points;
        document.getElementById(CHILD_IDS.ACCURACY_BONUS).innerHTML = accuracyBonus;
        return this;
    };

    that.setTimeBonus = function (points) {
        timeBonus = points;
        document.getElementById(CHILD_IDS.TIME_BONUS).innerHTML = timeBonus;
        return this;
    };

    that.setTotalScore = function (points) {
        totalScore = points;
        document.getElementById(CHILD_IDS.TOTAL_SCORE).innerHTML = totalScore;
        return this;
    };

    function _restart() {
        that.fireEvent('restart');
    }

    function _quit() {
        that.fireEvent('quit');
    }

    return that;
};
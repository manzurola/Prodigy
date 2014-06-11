var level;

function GameData() {
    this.questions = [];
}
GameData.prototype.question = function(index) {
    return this.questions[index];
};

function Game(data) {

}
Game.prototype.state = {
    score: 0,
    question: null
};
Game.prototype.onChoice = function(choice) {

};
Game.prototype.start = function() {

};
Game.prototype.pause = function() {

};
Game.prototype.resume = function() {

};
Game.prototype.restart = function() {

};
Game.prototype.quit = function() {

};

function FillDaBlank() {

}
FillDaBlank.prototype = Object.create(Game.prototype);
FillDaBlank.prototype.constructor = FillDaBlank;

var game = function (view, data) {

    var CSS_CLASS_NAMES = {
        PAUSE_BUTTON: 'pause-button'
    };

    var that = entity(view, data);

    var CHOICE_VIEW_FORMATS = {
        BY_BLANK   : 0,
        BY_QUESTION: 1,
        BY_EXERCISE: 2
    };

    var _score,
        _health = null,
        _autoMoveTimer = null,
        _autoMoveTimeout = 600,
        _combo = null,
        _starCounter = null,
        _clock = null,
        _feedback = null,
        _exercise = null,
        _blanksLeftInQuestion,
        _blanksLeftInGame,
        _selectedQuestion,
        _selectedBlank,
        _isPaused = false,
        _rawJsonExercise,
        _gameOverStats = {
            score        : 0,
            accuracyBonus: 0,
            timeBonus    : 0,
            totalScore   : 0
        };

    /**
     * Initializes game objects with supplied exercise data
     * @param exerciseJson a JSON object containing exercise data
     * @return {*}
     */
    that.initExercise = function (exerciseJson) {
        _init(exerciseJson);
        return this;
    };

    /**
     * @return {{score: number, accuracyBonus: number, timeBonus: number, totalScore: number}}
     */
    that.getGameStats = function () {
        return _gameOverStats;
    };

    /**
     * Gets the number of stars collected in current game
     * return {int}
     */
    that.getStarsCollected = function () {
        return _starCounter.getCount();
    };

    /**
     * Returns the maximum number of stars that could be collected in the current game.
     * @return {int}
     */
    that.getTotalStarsToCollect = function () {
        return _starCounter.getTotal();
    };

    /**
     * Gets the calculated grade from 0-100 based on the player's performance in current completed game
     * @return {int}
     */
    that.getGrade = function () {
        var totalStarsToCollect = _starCounter.getTotal();
        var starsCollected = _starCounter.getCount();
        return parseInt((starsCollected / totalStarsToCollect) * 100);
    };

    /**
     * Gets the amount of points received in current game
     * @return {int}
     */
    that.getScore = function () {
        return _score.getPoints();
    };

    /**
     * Starts the game - selects the first question in game.
     * @return {this}
     */
    that.start = function () {
        _start();
        return this;
    };

    /**
     * Pauses the current game - relevant only if a timer is ticking
     * @return {this}
     */
    that.pause = function () {
        _pause();
        return this;
    };

    /**
     * Resumes the game from a paused state
     * @return {this}
     */
    that.resume = function () {
        _resume();
        return this;
    };

    /**
     * Clears current game and starts a new one with same exercise
     * @return {this}
     */
    that.restart = function () {
        _restart();
        return this;
    };

    /**
     * Quits from game - clears screen and stats
     * @return {this}
     */
    that.quit = function () {
        //  TODO: nullify entities, stop clock etc.
        _clearScreen();
        return this;
    };

    /****************************************   private methods *************************************/

    /**
     *  Instantiates objects with supplied data and binds events.
     */
    function _init(exerciseJson) {

        _rawJsonExercise = exerciseJson;                //  KEEP REFERENCE OF LEVEL DATA IN CASE A RESTART IS INVOKED

        _clearScreen();                                 //  IN CASE A RESTART IS INVOKED

        _exercise = _createAndAppendExercise();         //  INIT LEVEL OBJECTS
        _subscribeToExerciseEntityEvents();

        _blanksLeftInGame = _exercise.countBlanks();
        _blanksLeftInQuestion = 0;
        _selectedQuestion = null;
        _selectedBlank = null;

        _feedback = _createAndAppendFeedback();

        _combo = _makeCombo();

        _starCounter = _createAndAppendStarCounter();

        _health = _createAndAppendHealth(10);   //  10  hitpoints default

        _score = _createAndAppendScore();

        _createAndAppendPauseButton();

        /*  init clock  */
        _clock = new Clock();

        return that;
    }

    /**
     * Not used
     * @param callback
     * @private
     */
    function _playIntro(callback) {
        logIt('playing intro...');
        setTimeout(function () {
            logIt('intro played');
            callback();
        }, 0);
    }


    /**
     * Event handler for a blank select event.
     *
     * If the blank is displaying a hint (isHintRevealed === true) than the hint is hidden.
     * Else If the supplied blank is in HintMode (hintEnabled), the _handleHintRequestEvent is invoked and the method returns.
     *
     * Otherwise the operation un-focuses any previous blank that invoked a 'select' event,
     * and focuses on the supplied blank. Finally invokes _showChoices().
     * @param targetBlank the target entity
     * @private
     */
    function _handleBlankSelectEvent(targetBlank) {

        logIt("handling blank select event. TARGET:");
        logIt(targetBlank);

        //  handle event only if blank is different from currently selected one
        if( targetBlank === _selectedBlank ){
            return;
        }

        //  reset the auto mov timer in cases where auto move was interrupted by user
        if (_autoMoveTimer) {
            clearTimeout(_autoMoveTimer);
            _autoMoveTimer = null;
        }

        //  if there is a previously selected blank, un-focus previous blank and focus current one
        if (_selectedBlank) {
            _selectedBlank.unFocus()
                .getMultiChoiceManager().remove();
            var prevBlankAnswer = _selectedBlank.getSubmittedAnswer();
            if (prevBlankAnswer) {
                prevBlankAnswer.getHint().remove();
            }
        }
        _selectedBlank = targetBlank;
        var newBlankAnswer = _selectedBlank.getSubmittedAnswer();
        if (newBlankAnswer) {
            newBlankAnswer.getHint().appendTo(_exercise);
        }
        _selectedBlank.focus()
            .getMultiChoiceManager().appendTo(_exercise);
    }

    /**
     * Event handler fot a multi choice select event.
     * @param multiChoice the target entity
     * @private
     */
    function _handleMultiChoiceSelectEvent(multiChoice) {

        if (_selectedBlank.isSolved()) {
            return;
        }

        var isCorrectChoice = _selectedBlank.submitAnswer(multiChoice.getAnswer());
        //            var isCorrect = multiChoice.getAnswer().isCorrect();
        if (isCorrectChoice) {
            _handleCorrectSubmission(multiChoice);
        } else {
            _handleFalseSubmission(multiChoice);
        }

    }

    /**
     * Handles a correct choice submission.
     * @param multiChoice
     * @private
     */
    function _handleCorrectSubmission(multiChoice) {
        //  if the blank contains a star, no mistakes were made
        if (_selectedBlank.getStar() !== null) {
            // Increment combo by one point
            _combo.increment();
            _starCounter.increment();
        }

        var pointsGranted = _selectedBlank.getPoints();     //  get remaining points from blank
        pointsGranted = _score.multiply(pointsGranted);     //  multiply by score multiplier
        _selectedBlank.setPoints(pointsGranted);            //  set multiplied points to blank
        _score.increment(pointsGranted);                    //  increment score
        /*  update state    */
        _blanksLeftInGame--;
        _blanksLeftInQuestion--;
        /*  remove previous hint and append new one */
        var prevSubmittedAnswer = _selectedBlank.getSubmittedAnswer();
        if (prevSubmittedAnswer) {
            logIt('previous answer: ' + prevSubmittedAnswer.getToken());
            prevSubmittedAnswer.getHint().remove();
        }
        var submittedAnswer = multiChoice.getAnswer();
        submittedAnswer.getHint().appendTo(_exercise);

        /*  update entities */
        multiChoice.setFeedbackOnCorrect(_combo.getFeedback())
            .toggleState(multiChoice.states().CORRECT);
        _selectedBlank.submitAnswer(multiChoice.getAnswer());        //  change state of blank

        //  if question completed
        if (_blanksLeftInQuestion <= 0) {
            _handleQuestionSolvedEvent();
            logIt('question solved in submit correct choice');
        } else {
            //  the auto move to next blank is triggered after a set time to display a complete animation of a correct submission
            _autoMoveTimer = setTimeout(_selectNextUnsolvedBlankInQuestion, _autoMoveTimeout);
        }
        //  TODO: show correct feedback
    }

    /**
     * Handles a false choice submission
     * @param multiChoice
     * @private
     */
    function _handleFalseSubmission(multiChoice) {

        _combo.lose();     //  loose combo
        _score.resetMultiplier();
        _health.hurt();    //   decrement one hitpoint from health

        //  decrease remaining points in blank by half
        var pointsRemainingInBlank = parseInt(_selectedBlank.getPoints() / 2);
        _selectedBlank.setPoints(pointsRemainingInBlank);

        /*  remove previous hint and append new one */
        var prevSubmittedAnswer = _selectedBlank.getSubmittedAnswer();
        if (prevSubmittedAnswer) {
            logIt('previous answer: ' + prevSubmittedAnswer.getToken());
            prevSubmittedAnswer.getHint().remove();
        }
        var answerToSubmit = multiChoice.getAnswer();
        answerToSubmit.getHint().appendTo(_exercise);

        //        _thisBlank.solved(false);                   //  animate mistake in blank
        multiChoice.toggleState(multiChoice.states().MISTAKE);          //  animate mistake in multichoice
        _selectedBlank.submitAnswer(answerToSubmit);        //  change state of blank

        //  TODO: show hint or present option to trigger hint
        if (_health.getHitpoints() <= 0) {
            _exerciseFailed();
        }
    }

    function _handleHintSelectEvent(targetHint) {
        //  if the target hint is revealed, do nothing
        if (targetHint.hasBeenRevealed()) {
            targetHint.disable();
        } else if (targetHint.isEnabled()) {
            targetHint.reveal();
        }
        logIt('handling hint select event. Target:');
        logIt(targetHint);
        //  else reveal the hint
    }

    /**
     * Triggers a 'select' event on the next empty blank in current question.
     * Assumes that there are in fact more empty blanks in question.
     *
     * This method considers the choiceViewFormat to decide when to invoke the move.
     *
     * @private
     */
    function _selectNextUnsolvedBlankInQuestion() {

        var nextEmptyBlank = _selectedQuestion.findNextUnsolvedBlank(_selectedBlank.getIndex());
        if (nextEmptyBlank === null) {
            nextEmptyBlank = _selectedQuestion.getBlanks()[0];  //  select first blank if all blanks are solved
        }
        _handleBlankSelectEvent(nextEmptyBlank);
    }

    /**
     * Sets the supplied question as the current active one and hides the previously focused question.
     * Triggers a select event on the first blank of the question.
     * Sets the combo count to this question.
     * @param targetQuestion the next question to select
     * @private
     */
    function _handleQuestionSelectEvent(targetQuestion) {

        logIt('question select event');

        //  verify that target is different from current question so a blank is automatically selected
        if (targetQuestion !== _selectedQuestion) {

            if (_selectedQuestion) {
                _selectedQuestion.remove();   //  hide previously selected question
            }

            _selectedQuestion = targetQuestion.appendTo(_exercise);

            //  update state if question is new and unsolved
            if (!targetQuestion.isSolved()) {
                _blanksLeftInQuestion = _selectedQuestion.countUnsolvedBlanks();
            }
            _handleBlankSelectEvent(_selectedQuestion.getBlanks()[0]);
        }
    }

    /**
     * Event handler for a question prev select event.
     *
     * Invokes select on the previous question of the target question, if it not the first question
     * @param  targetQuestion
     * @private
     */
    function _handleQuestionPrevEvent(targetQuestion) {
        var prevQuestion = targetQuestion.getPrevQuestion();
        if (prevQuestion) {
            _handleQuestionSelectEvent(prevQuestion);
        }
    }

    /**
     * Event handler for a question next select event.
     * The method is processed only if the target is solved.
     *
     * Invokes select on the next question of the target question, if one exists.
     * Otherwise the last question is assumed to be selected and the exerciseCleared method
     * is invoked.
     * @param  targetQuestion
     * @private
     */
    function _handleQuestionNextEvent(targetQuestion) {

        if (targetQuestion.isSolved()) {
            //  get next question
            var nextQuestion = targetQuestion.getNextQuestion();

            //  if one exists, select it
            if (nextQuestion) {
                _handleQuestionSelectEvent(nextQuestion);
            } else {      //  else end of exercise!
                _exerciseCleared();
            }
        }
    }

    /**
     * Handles a question complete event. Presents the next-question button if there are
     * more questions in this exercise. Else triggers an exerciseComplete event.
     * @private
     */
    function _handleQuestionSolvedEvent() {

        //  set the current question as solved
        _selectedQuestion.solved(true);

        //  if combo count equals the total number of blanks in current question - no mistakes were made
        //  increment score multiplier
        if (_combo.getCount() >= _selectedQuestion.countBlanks()) {
            _score.incrementMultiplier();
        }
    }

    function _exerciseFailed() {

        logIt('!!! - exercise failed');

        _clock._pause();

        that.fireEvent('exerciseFailed');   //  fire event
    }

    function _exerciseCleared() {
        logIt('!!! - exercise cleared');

        _calculateGameOverStats();

        that.fireEvent('exerciseCleared');  // fire event
    }

    function _start() {
        _exercise.getQuestions()[0].fireEvent('select');
    }

    /**
     *  pauses current active game
     */
    function _pause() {
        _isPaused = true;
        //_clock._pause();
        that.fireEvent('pause');
    }

    /**
     *  resumes game from paused state
     */
    function _resume() {
        _isPaused = false;
    }

    /**
     *  restarts the current level
     */
    function _restart() {
        _init(_rawJsonExercise);
        _start();
    }

    /**
     * Quits to main menu screen
     * @private
     */
    function _quit() {
        _clearScreen();
        that.fireEvent('quit');
    }

    function _clearScreen() {
        while (view.lastChild) {
            view.removeChild(view.lastChild);
        }
    }

    function _calculateGameOverStats() {
        _gameOverStats.score = _score.getPoints();
        _gameOverStats.accuracyBonus = _health.getHitpoints() * 100;
        _gameOverStats.totalScore = _gameOverStats.score + _gameOverStats.accuracyBonus;
        return _gameOverStats;
    }

    /************************  ENTITY CREATION AND CONFIGURATION   *****************/


    function _subscribeToExerciseEntityEvents() {
        //  for each question in exercise
        _exercise.getQuestions().map(function (question) {
            question.on('select', _handleQuestionSelectEvent, question)
                .on('prev', _handleQuestionPrevEvent, question)     //  on request for prev question
                .on('next', _handleQuestionNextEvent, question)     //  on request for next question
                //  for each blank in question
                .getBlanks()
                .map(function (blank) {
                    blank.on('select', _handleBlankSelectEvent, blank)     //  subscribe to blank select events
                        .getMultiChoiceManager()
                        .getChoices()
                        .map(function (choice) {
                            choice.on('select', _handleMultiChoiceSelectEvent, choice);     //  multi choice select event
                        })
                })
        });
    }

    /**
     * Creates and appends an Exercise to screen. Configuration of event listeners for contained entities
     * is done here. Included entities are question, blank.
     *
     * @private
     */
    function _createAndAppendExercise() {
        var exerciseView = document.createElement('div');
        view.appendChild(exerciseView);
        return exercise(exerciseView, _rawJsonExercise);
    }

    /**
     *
     * @return {*}
     * @private
     */
    function _createAndAppendFeedback() {
        var feedbackView = document.createElement('div');
        view.appendChild(feedbackView);
        return feedback(feedbackView, {});
    }

    /**
     *
     * @return {*}
     * @private
     */
    function _makeCombo() {
        var comboView = document.createElement('div');
        return combo(comboView, {});
        //            .on('nextMultiplierLevelReached', _nextMultiplierLevelReached)
        //            .on('comboLost', _handleComboLostEvent);
    }

    /**
     *
     * @return {null}
     * @private
     */
    function _createAndAppendHealth(hitpoints) {
        var healthView = document.createElement('div');
        var entity = health(healthView, {
            'hitpoints': hitpoints
        });
        view.appendChild(healthView);
        return entity;
    }

    function _createAndAppendStarCounter() {
        var starCounterView = document.createElement('div');
        var entity = starCounter(starCounterView, {'total': _exercise.countBlanks()}); //TODO: star counter total
        view.appendChild(starCounterView);
        return entity;
    }

    /**
     *
     * @return {*}
     * @private
     */
    function _createAndAppendScore() {
        var scoreView = document.createElement('div');
        view.appendChild(scoreView);
        return score(scoreView, {});
    }


    /**
     * Creates and appends a puase button to screen
     * @return {HTMLElement}
     * @private
     */
    function _createAndAppendPauseButton() {
        var pauseButton = document.createElement('div');
        pauseButton.className = CSS_CLASS_NAMES.PAUSE_BUTTON;
        pauseButton.addEventListener('click', function () {
            _pause();
        });
        view.appendChild(pauseButton);
        return pauseButton;
    }

    return that;

};     //  end game class

window.onload = function(e) {
//    var c = multiChoice(document.createElement('div'), {});
//    var cc = multiChoiceManager(document.createElement('div'),{});
//    var ccc = combo(document.createElement('div'),{});
//    var health = health(document.createElement('div'),{});
//    var st = starCounter(document.createElement('div'),{});
//    var s = score(document.createElement('div'),{});
//    var exercise = exercise(document.createElement('div'),{});

    var remote = new Remote();
    remote.get('http://localhost:8080/rest/exercises/3', function(data) {
        logIt('here');
        var json = JSON.parse(data.target.responseText)['exercise'];
        var elem =   document.getElementById('fillDaBlank');
        logIt(elem);
        level = game(document.getElementById('game'), {})
            .initExercise(json)
            .start();
    }, false);
};


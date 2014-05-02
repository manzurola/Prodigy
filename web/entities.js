/**
 * Created with IntelliJ IDEA.
 * User: guy
 * Date: 4/26/13
 * Time: 10:44 AM
 * To change this template use File | Settings | File Templates.
 */

var multiChoice = function (view, spec) {

    var CSS_CLASS_NAMES = {
        NORMAL:         'multichoice',
        MISTAKE:        'multichoice mistake',
        MISTAKE_STATIC: 'multichoice mistake-static',
        CORRECT:        'multichoice correct',
        CORRECT_STATIC: 'multichoice correct-static',
        HIDDEN:         'multichoice hidden',
        BOWING:         'bowing'
    };

    var that = entity(view, spec),
        baseAppendTo = that.appendTo;

    var STATES = {
        NORMAL:  1,
        CORRECT: 2,
        MISTAKE: 3,
        HINT:    4,
        HIDDEN:  5,
        BOWING:  6
    };

    var ANIMATIONS = {
        CORRECT: 0,
        MISTAKE: 1
    };

    var answer = spec['answer'],
        tokenElement,
        lastChild = document.createElement('span'),
        manager = spec['manager'] || {},
        state = STATES.NORMAL;

    (function init() {
        view.className = CSS_CLASS_NAMES.NORMAL;

        tokenElement = document.createElement('span');
        tokenElement.innerHTML = answer.getToken();
        lastChild.innerHTML = "OK!";

        var fragment = document.createDocumentFragment();
        fragment.appendChild(tokenElement);
        fragment.appendChild(lastChild);
        view.appendChild(fragment);
    })();

    /**
     * Toggles the state of this multichoice.
     * @param other
     */
    that.toggleState = function (other) {
        if (other === state) {
            view.className = CSS_CLASS_NAMES.NORMAL;
        }
        state = other;
        switch (state) {
            case STATES.CORRECT:
                _animateCorrect();
                break;
            case STATES.MISTAKE:
                _animateMistake();
                break;
            case STATES.HIDDEN:
                _animateHidden();
                break;
        }
    };

    that.setFeedbackOnCorrect = function (text) {
        lastChild.innerHTML = text;
        return this;
    };

    that.getState = function () {
        return state;
    };

    that.getManager = function () {
        return manager;
    };

    that.states = function () {
        return STATES;
    };

    that.animations = function () {
        return ANIMATIONS;
    };

    that.getAnswer = function () {
        return answer;
    };

    /**
     * NOT IMPLEMENTED
     */
    that.putAnswer = function () {
        throw ERRORS.NOT_IMPLEMENTED;
    };

    /**
     * Animates a false submission
     * @private
     */
    function _animateMistake() {

        view.addEventListener('webkitAnimationEnd', _handleMistakeAnimationEndEvent);
        view.className = CSS_CLASS_NAMES.MISTAKE;
    }

    function _handleMistakeAnimationEndEvent() {
        view.removeEventListener('webkitAnimationEnd', arguments.callee);
        that.fireEvent('mistakeAnimationEnd');
        view.className = CSS_CLASS_NAMES.MISTAKE_STATIC;
    }

    function _defaultMode() {
        view.className = CSS_CLASS_NAMES.NORMAL;
    }

    /**
     * Replaces the view of this object with an alternate view for a set amount of time
     * and reverts to the original view at timeout
     * @private
     */
    function _animateCorrect() {

        view.addEventListener('webkitAnimationEnd', _handleCorrectAnimationEndEvent);
        view.className = CSS_CLASS_NAMES.CORRECT;
    }

    function _handleCorrectAnimationEndEvent() {
        view.removeEventListener('webkitAnimationEnd', arguments.callee);
        that.fireEvent('correctAnimationEnd');
        view.className = CSS_CLASS_NAMES.CORRECT_STATIC;
    }

    function _animateHidden() {
        view.addEventListener('webkitAnimationEnd', _handleHiddenAnimationEndEvent);
        view.className = CSS_CLASS_NAMES.HIDDEN;
    }

    function _handleHiddenAnimationEndEvent() {
        view.removeEventListener('webkitAnimationEnd', arguments.callee);
        //        _defaultMode();
        that.fireEvent('hiddenAnimationEnd');
    }

    return that;
};

/**
 * Consolidates multi choice handling and binding.
 */
var multiChoiceManager = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF: 'multichoicer'
    };

    var that = entity(view, spec),
        baseRemove = that.remove,
        baseAppendTo = that.appendTo;

    var multiChoices = [],
        introTimer,
        _introTimeOut = 0;

    /**
     * Initialize this object with supplied answers
     * @private
     */
    (function init() {

        view.className = CSS_CLASS_NAMES.SELF;

        var answers = spec['answers'];
        var answerTokens = spec['answerTokens'];

        for (var i = 0; i < answers.length; i++) {
            var choiceData = {
                'answer': answers[i]
            };
            multiChoices.push(_makeMultiChoice(choiceData));
        }
    }());

    that.getChoices = function () {
        return multiChoices;
    };

    that.appendTo = function (parent) {
        baseAppendTo.apply(that, [parent]);
        _appendChoices();
        return this;
    };

    that.remove = function () {
        baseRemove.apply(that, []);
        _removeChoices();
        return this;
    };

    function _appendChoices() {
        var counter = 1;
        for (var i = 0; i < multiChoices.length; i++) {
            var choice = multiChoices[i];

            (function (target, targetCount) {
                introTimer = setTimeout(function () {
                    target.appendTo(that);
                    if (targetCount === multiChoices.length) {
                        clearTimeout(introTimer);
                    }
                }, targetCount * _introTimeOut);
            }(choice, counter));
            counter++;
        }
    }

    function _removeChoices() {
        for (var i = 0; i < multiChoices.length; i++) {
            var choice = multiChoices[i];
            choice.remove();
        }
    }

    function _makeMultiChoice(data) {
        var choiceView = document.createElement('li');
        return multiChoice(choiceView, data);
    }

    return that;
};

var combo = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF: 'combo'
    };

    var that = entity(view, spec);

    var counter = _makeComboCounter(0),
        feedbackArray = [
            "ok!",
            "good!",
            "nice!",
            "great!",
            "grand!",
            "awesome!",
            "excellent!",
            "splendid!",
            "superb!",
            "star!",
            "amazing!",
            "incredible!",
            "spectacular!",
            "prodigy!!"
        ],
        currentFeedback;

    (function () {
        view.className = CSS_CLASS_NAMES.SELF;
    }());

    that.increment = function () {

        //  increment counter
        var count = counter.getData()['value'] + 1;
        counter.remove();
        counter = _makeComboCounter(count).appendTo(that);
        return this;
    };

    /**
     * Gets the count of the current combo
     *
     * @return {number}
     */
    that.getCount = function () {
        return counter.getData()['value'];
    };

    that.lose = function () {
        counter.remove();
        counter = _makeComboCounter(0).appendTo(this);
        return this;
    };

    that.getFeedback = function () {
        var index = counter.getData()['value'];
        return index < feedbackArray.length ? feedbackArray[index] : feedbackArray[feedbackArray.length - 1];
    };

    function _makeComboCounter(count) {

        var countView = document.createElement('span');
        //  DON'T DISPLAY combo less than 2
        return entity(countView, {'value': count}).setInnerText(count > 1 ? count : "");
    }

    return that;

};

var health = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF:         'health',
        HURT:         'hurt',
        LIVES_LEFT_3: 'lives-left-3',
        LIVES_LEFT_2: 'lives-left-2',
        LIVES_LEFT_1: 'lives-left-1',
        LIVES_LEFT_0: 'lives-left-0',
        HEART:        'health-heart',
        HIT_POINTS:   'health-strikes'
    };

    var that = entity(view);

    var hitpoints = spec['hitpoints'] || 10,
        timesHurt = 0,
        hitpointsLeftView;

    (function init() {

        view.className = CSS_CLASS_NAMES.SELF;

        hitpointsLeftView = document.createElement('span');
        hitpointsLeftView.innerHTML = "" + hitpoints;
        view.appendChild(hitpointsLeftView);
    }());

    that.increment = function (points) {
        hitpoints += points;
    };

    that.getHitpoints = function () {
        return hitpoints;
    };

    /**
     * Decrements the amount of hitpoints.
     * Each invocation is counted as a hit.
     * @param points
     */
    that.decrement = function (points) {
        hitpoints -= points;
        timesHurt++;
        hitpointsLeftView.innerHTML = '' + hitpoints;
        if (hitpoints <= 0) {
            that.fireEvent('hitpointsDepleted');
        }
    };

    that.getTimesHurt = function () {
        return timesHurt;
    };

    /**
     * Decrements a single hitpoint from health and increments the timesHurt variable by one.
     * If hitpoints are depleted after operation (hitpoints == 0 ) than a hitpointsDepleted event is fired
     */
    that.hurt = function () {
        hitpoints -= 1;
        timesHurt++;
        hitpointsLeftView.innerHTML = '' + hitpoints;
        if (hitpoints <= 0) {
            that.fireEvent('hitpointsDepleted');
        }
        _animateHurt();
        return this;
    };

    function _animateHurt() {
        view.addEventListener('webkitAnimationEnd', _handleHurtAnimationEnd);
        view.classList.add(CSS_CLASS_NAMES.HURT);
    }

    function _handleHurtAnimationEnd() {
        view.removeEventListener('webkitAnimationEnd', arguments.callee);
        view.classList.remove(CSS_CLASS_NAMES.HURT);
        that.fireEvent('hurtAnimationEnd');
    }

    return that;
};

var starCounter = function (view, spec) {
    var CSS_CLASS_NAMES = {
        SELF: 'starCounter'
    };

    var that = entity(view, spec);

    var starCount,
        total = spec['total'] || 0,
        count = 0;

    (function () {
        view.className = CSS_CLASS_NAMES.SELF;
        starCount = _createAndAppendStarCount();
    }());

    that.increment = function () {
        count++;
        starCount.hide();
        starCount = _createAndAppendStarCount();
        return this;
    };

    that.getCount = function () {
        return count;
    };

    /**
     * Gets the total amount of stars to collect
     * @return {*|number}
     */
    that.getTotal = function () {
        return total;
    };

    function _createAndAppendStarCount() {
        var starCountView = document.createElement('span');
        view.appendChild(starCountView);
        return entity(starCountView, {})
            .setInnerText(count);
    }

    return that;
};

var score = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF:       'score',
        MULTIPLIER: 'score-multiplier',
        POINTS:     'score-points'
    };

    var that = entity(view, spec);

    var points = _createAndAppendPoints(0),
        multiplier = _createAndAppendMultiplier(0);

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;
    }());

    /**
     * Increments score by amount of points supplied
     * @param pointsToAdd
     */
    that.increment = function (pointsToAdd) {

        //  select increment jump, i.e. delta
        var delta;
        if (pointsToAdd >= 250) {
            delta = 10;
        } else {
            //            delta = 1;
            delta = 5;  //  testing
        }
        var total = points.getData()['value'] + pointsToAdd;
        points.setData({'value': total});

        _animateScoreIncrement(pointsToAdd, delta, total);
        return this;
    };

    that.getMultiplierLevel = function () {
        return _getMultiplierLevel();
    };

    that.getPoints = function () {
        return points.getData()['value'];
    };

    /**
     * Multiplies the supplied amount by the current score multiplier and returns the calculated amount
     * @param amount
     */
    that.multiply = function (amount) {
        var level = multiplier.getData()['value'];
        return  level > 0 ? amount * level : amount;
    };

    /**
     * Increments the multiplier and returns the new multiplier level reached.
     * @return {*}
     */
    that.incrementMultiplier = function () {
        var value = multiplier.getData()['value'];
        value++;
        multiplier.setData({'value': value});
        if (value > 1) {
            multiplier.remove();
            multiplier = _createAndAppendMultiplier(value);
        }
        return this;
    };

    that.resetMultiplier = function () {
        multiplier.setData({'value': 0}).hide();
        return this;
    };

    function _getMultiplierLevel() {
        return multiplier.getData()['value'];
    }

    function _createAndAppendMultiplier(value) {
        var multiplierView = document.createElement('span');
        multiplierView.className = CSS_CLASS_NAMES.MULTIPLIER;
        view.appendChild(multiplierView);
        return entity(multiplierView, {'value': value}).setInnerText(value > 1 ? value : "");
    }

    function _createAndAppendPoints(value) {
        var pointsView = document.createElement('span');
        pointsView.className = CSS_CLASS_NAMES.POINTS;
        view.appendChild(pointsView);
        return entity(pointsView, {'value': value}).setInnerText(value);
    }

    function _animateScoreIncrement(pointsToAdd, delta, total) {

        if (pointsToAdd === 0) {
            return;
        }

        //  if the increment is larger than the amount of remaining points to add,
        //  et the increment to that amount
        if (pointsToAdd < delta) {
            delta = pointsToAdd;
        }

        points.setInnerText(total - pointsToAdd + delta);

        setTimeout(function () {
            _animateScoreIncrement(pointsToAdd - delta, delta, total);
        }, 10);
    }

    return that;
};

//    var Clock = function (data) {
//        var _LAST_N_CRITICAL_SECONDS = 60;
//
//        var _this = this;
//        var _data;
//        var _view;
//        var _secondsView;
//        var _minutesView;
//        var _timer = null;
//        var _isStopped = false;
//
//        var _time = {
//            seconds : 0,
//            minutes : 0
//        };
//
//        //  INIT
//        (function () {
//            _data = {
//                secondsToCountdown: data['secondsToCountdown'],
//                onTimeEndEventListener: data['onTimeEndEventListener'] || function(){}
//            }
//            _view = document.getElementById('time');
//            _secondsView = document.getElementById('seconds');
//            _minutesView = document.getElementById('minutes');
//        })();
//
//        var runIntervals = function (secondsToCountDown, callback) {
//            var MILIS_IN_SECOND = 1000;
//            //  RUN AN INTERVAL AS A ONE SECOND COUNTDOWN, UPDATE VIEWS UPON INTERVAL COMPLETION
//            _timer = setInterval(function () {
//                clearInterval(_timer);
//
//                //  decrement one seconds and update time variable
//                if( _time.seconds === 0 ){
//                    _time.minutes--;
//                    _time.seconds = 59;
//                }else{
//                    _time.seconds--;
//                }
//
//                //  THE STOPPING CONDITION -
//                //  if clock was stopped explicitly or if countdown is over  - TERMINATE
//                if (_isStopped || secondsToCountDown === 0) {
//                    //  terminate
//                    reset();
//                    callback();
//                    return;
//                }
//                //  IF EXACTLY N SECONDS ARE LEFT TO COUNTDOWN
//                if (secondsToCountDown === _LAST_N_CRITICAL_SECONDS) {
//                    initializeCriticalTimeAnimation();
//                }
//                //  CONTINUE WITH NORMAL COUNTDOWN
//                updateViews();
//                runIntervals(secondsToCountDown - 1, callback);   //   invoke recursively
//
//            }, MILIS_IN_SECOND);
//        }
//
//        var reset = function () {
//            _time.seconds = _data.secondsToCountdown % 60;
//            _time.minutes = parseInt(_data.secondsToCountdown / 60);
//        }
//
//        var updateViews = function(){
//            _secondsView.innerText = _time.seconds;
//            _minutesView.innerText = _time.minutes;
//        }
//
//        var initializeCriticalTimeAnimation = function(){
//            //  TODO: start animation of last n critical seconds
//        }
//
//        this._start = function () {
//            //  reset shared variables before invoking runIntervals
//            reset();
//            updateViews();
//            runIntervals(_data.secondsToCountdown, _data.onTimeEndEventListener);
//        }
//
//        this._stop = function () {
//            _isStopped = true;
//        }
//    }

var Clock = function () {
    var _this = this;
    var _view;
    var _millisecondsView;
    var _secondsView;
    var _minutesView;
    var _timer = null;
    var _paused = false;

    var _time = {
        milliseconds: 0,
        seconds:      0,
        minutes:      0
    };

    //  INIT
    (function () {
        _view = document.getElementById('time');
        //_millisecondsView = document.getElementById('milliseconds');
        _secondsView = document.getElementById('seconds');
        _minutesView = document.getElementById('minutes');
    })();

    var runIntervals = function () {
        var MILIS_IN_SECOND = 1000;
        //  RUN AN INTERVAL AS A ONE SECOND COUNTDOWN, UPDATE VIEWS UPON INTERVAL COMPLETION
        _timer = setInterval(function () {
            clearInterval(_timer);

            if (_paused) {
                return;
            }

            _time.seconds++;

            //  increment one seconds and update time variable
            if (_time.seconds === 60) {
                _time.minutes++;
                _time.seconds = 0;
            }

            updateViews();
            runIntervals();   //   invoke recursively

        }, MILIS_IN_SECOND);
    };

    var reset = function () {
        _time.seconds = 0;
        _time.minutes = 0;
        updateViews();
    };

    var updateViews = function () {
        _secondsView.innerText = _time.seconds;
        _minutesView.innerText = _time.minutes;
    };

    this._start = function () {
        //  reset shared variables before invoking runIntervals
        reset();
        runIntervals();
        return _this;
    };

    this._pause = function () {
        _paused = true;
        return _this;
    };

    this._resume = function () {
        _paused = false;
        runIntervals();
        return _this;
    };

    this._getElapsedInMilliseconds = function () {
        return _time.minutes * 60 * 1000 + _time.seconds * 1000 + _time.milliseconds;
    }

};

var exercise = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF:           'exercise',
        EXERCISE_TITLE: 'exercise-title',
        SUBJECT_MATTER: 'exercise-subjectMatter'
    };

    var that = entity(view, spec);

    var title,
        subject,
        exerciseProgression,
        instructions = spec['instructions'] || "",
        questions = [],
        numOfQuestionsCompleted = 0,
        blanksTotal = 0,
        isComplete = false,
        isLastQuestion = false;

    (function _init() {
        view.className = CSS_CLASS_NAMES.SELF;

        var questionsData = spec['questions'];

        //  create questions but do not append to exercise
        var prev = null, current = null, next = null;
        for (var i = 0; i < questionsData.length; i++) {

            var currentQuestionData = {
                'index':   i,
                'html':    questionsData[i]['html'],
                'blanks':  questionsData[i]['blanks'],
                'isFirst': !!(i === 0),
                'isLast':  !!(i === questionsData.length - 1)
            };

            //  set the prev question to give to the new question as the current question of prev iteration
            prev = current;

            //  the default next question is null
            next = null;
            current = _makeQuestion(currentQuestionData);
            questions.push(current);

            current.setPrevQuestion(prev);      //  prev question of current one
            current.setNextQuestion(next);

            //  the current question of last iteration now receives a next question
            // (which is this iteration's current one)
            if (prev) {
                prev.setNextQuestion(current);      //  next question of previous one
            }

            _setMultiChoiceManagersToBlanksInQuestion(current);
        }

        title = _makeTitle(spec['title']).appendTo(that);
        subject = _makeSubject(spec['subjectName']).appendTo(that);
        exerciseProgression = _makeProgressBar().appendTo(that);
    }());

    that.getQuestions = function () {
        return questions;
    };

    that.isLastQuestion = function () {
        return isLastQuestion;
    };

    /**
     *  Sets this exercise state as complete and fires a 'complete' event
     */
    that.setComplete = function () {
        isComplete = true;
        that.fireEvent('complete');
    };

    /**
     * Gets the total number of questions
     * @return {Number}
     */
    that.getQuestionsCount = function () {
        return questions.length;
    };

    /**
     * Gets the total number of blanks in all questions
     * @return {number}
     */
    that.countBlanks = function () {
        return blanksTotal;
    };

    that.getAllBlanks = function () {
        var blanks = [];
        for (var i = 0; i < questions.length; i++) {
            var blanksInQuestion = questions[i].getBlanks();
            for (var j = 0; j < blanksInQuestion.length; j++) {
                blanks.push(blanksInQuestion[j]);
            }
        }
        return blanks;
    };

    /**
     * Gets a collection of all answers in all questions
     * @return {Array}
     */
    that.getAllAnswers = function () {
        var answers = [];
        for (var i = 0; i < questions.length; i++) {
            var answersInQuestion = questions[i].getAllAnswers();
            for (var j = 0; j < answersInQuestion.length; j++) {
                answers.push(answersInQuestion[j]);
            }
        }
        return answers;
    };

    function _setMultiChoiceManagersToBlanksInQuestion(aQuestion) {
        var blanks = aQuestion.getBlanks();
        for (var i = 0; i < blanks.length; i++) {
            var blank = blanks[i];
            var answers = blank.getAnswers();
            var multiChoicer = _makeMultiChoiceManager(answers);
            blank.setMultiChoiceManager(multiChoicer);
            blanksTotal++;
        }
    }

    /**
     * Handles a question 'solved' event.
     * Increments the progress bar value.
     * If the question is last, a 'complete' event is fired by this exercise.
     * @param aQuestion
     * @private
     */
    function _handleQuestionSolvedEvent(aQuestion) {
        numOfQuestionsCompleted++;
        exerciseProgression.increment((1 / questions.length) * 100);
        if (numOfQuestionsCompleted === questions.length) {
            //  last question was completed - exercise completed
            that.fireEvent('solved');
        }
    }

    function _makeQuestion(data) {
        var questionView = document.createElement('div');
        return question(questionView, data)
            .on('solved', _handleQuestionSolvedEvent);
    }

    function _makeMultiChoiceManager(answers) {

        //  shuffle answers
        var shuffledAnswers = answers.shuffle();

        //  create new multiChoice manager object
        var managerView = document.createElement('div');
        return multiChoiceManager(managerView, {
            'answers': shuffledAnswers
        });
    }

    function _makeTitle(text) {
        var titleView = document.createElement('div');
        titleView.innerHTML = typeof text === 'string' ? text : "";
        titleView.className = CSS_CLASS_NAMES.EXERCISE_TITLE;
        return entity(titleView, {});
    }

    function _makeSubject(name) {
        var subjectView = document.createElement('div');
        subjectView.className = CSS_CLASS_NAMES.SUBJECT_MATTER;
        subjectView.innerHTML = typeof name === 'string' ? name : "";
        return entity(subjectView, {});
    }

    function _makeProgressBar() {
        var progressBarView = document.createElement('div');
        return progressBar(progressBarView, {'value': 0});
    }

    return that;
};

var question = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF:   'question',
        SOLVED: 'solved',
        LAST:   'last',
        FIRST:  'first',
        BLANK:  'blank',
        PREV:   'prev-question-button',
        NEXT:   'next-question-button'
    };

    var that = entity(view, spec),
        baseRemove = that.remove;

    var blanks = [],
        prevButton,
        nextButton,
        prevQuestion,
        nextQuestion,
        isSolved = false,
        isFirst = spec['isFirst'],
        isLast = spec['isLast'];

    (function init() {

        view.className = CSS_CLASS_NAMES.SELF;
        view.innerHTML = spec['html'];

        //  update view if this question is first or last
        //  affects the prev and next buttons
        if (isFirst) {
            view.classList.add(CSS_CLASS_NAMES.FIRST);
        }
        if (isLast) {
            view.classList.add(CSS_CLASS_NAMES.LAST);
        }

        var spanBlankClassNodeList = view.getElementsByClassName(CSS_CLASS_NAMES.BLANK);
        for (var i = 0; i < spanBlankClassNodeList.length; i++) {

            var blankData = {
                'index':          i,
                'answers':        spec['blanks'][i]['answers'],
                'parentQuestion': that
            };
            var blankView = spanBlankClassNodeList[i];
            blanks.push(blank(blankView, blankData));
        }

        prevButton = _makePrevButton().appendTo(that);
        nextButton = _makeNextButton().appendTo(that);

    })();

    that.remove = function () {
        for (var i = 0; i < blanks.length; i++) {
            var blank = blanks[i];
            if (blank.isSolved()) {
                blank.removeInnerEntitiesAfterSolved();
            }
        }
        baseRemove.apply(this);
        return this;
    };

    that.countBlanks = function () {
        return blanks.length;
    };

    /**
     *  Toggles the state of the question based on the supplied parameter.
     *  If bool === true
     *      then the state is toggled to solved and a "solved" event is fired
     *  Else the state is toggled to unsolved.
     */
    that.solved = function (bool) {
        if (bool === true) {
            isSolved = true;
            _solve();
            that.fireEvent('solved');
        } else {
            isSolved = false;
        }
        return this;
    };

    that.isSolved = function () {
        return isSolved;
    };

    /**
     * Finds the next incomplete blank in question and returns that blank.
     * If all blanks are complete return null.
     * @param {number} blankIndexOffset the starting index to search from
     * @return {blank} the next incomplete blank in question or null if all blanks are complete
     */
    that.findNextUnsolvedBlank = function (blankIndexOffset) {

        logIt("blank index offset: " + blankIndexOffset);

        var nextBlank = null;
        var nextBlankIndex = blankIndexOffset + 1;

        if (blanks[blankIndexOffset] && !blanks[blankIndexOffset].isSolved()) {
            return blanks[blankIndexOffset];
        }

        //  visit all blanks starting from focused blank up to its preceding one
        for (var visitedTotal = 0; visitedTotal < blanks.length; visitedTotal++) {
            //  if next blank is out of range - reset next blank index
            if (nextBlankIndex >= blanks.length) {
                nextBlankIndex = 0;
            } else if (!blanks[nextBlankIndex].isSolved()) {
                //  else if blank is unsolved - found it !
                nextBlank = blanks[nextBlankIndex];
                break;
            } else {                  //  continue to next blank
                nextBlankIndex++;
            }
        }
        return nextBlank;
    };

    /**
     * Returns the number of unsolved blanks in question
     */
    that.countUnsolvedBlanks = function () {
        var count = 0;
        for (var i = 0; i < blanks.length; i++) {
            if (!blanks[i].isSolved()) {
                count++;
            }
        }
        return count;
    };

    that.getBlanks = function () {
        return blanks;
    };

    /**
     *
     * @param index
     * @return {*} a Blank object at the specified index, or null if index out of bounds
     */
    that.getBlankAt = function (index) {
        if (blanks[index]) {
            return blanks[index];
        } else {
            return null;
        }
    };

    /**
     * return a collection of all Answer objects for each blank in question,
     * sorted by order of appearance of blank. i.e blank1.answers .. blankN.answers
     */
    that.getAllAnswers = function () {
        var allAnswers = [];
        for (var i = 0; i < blanks.length; i++) {
            var answersForBlank = blanks[i].getAnswers();
            for (var j = 0; j < answersForBlank.length; j++) {
                allAnswers.push(answersForBlank[j]);
            }
        }
        return allAnswers;
    };

    that.getIndex = function () {
        return spec['index'];
    };

    that.getPrevQuestion = function () {
        return prevQuestion;
    };

    that.setPrevQuestion = function (prev) {
        prevQuestion = prev;
        return this;
    };

    that.getNextQuestion = function () {
        return nextQuestion;
    };

    that.setNextQuestion = function (next) {
        nextQuestion = next;
        return this;
    };

    function _solve() {
        view.classList.add(CSS_CLASS_NAMES.SOLVED);
    }

    /**
     * Creates a new entity representing the prev button and appends it to view.
     * Subscribes to its 'select' event which triggers that's 'prev' event
     * @return {*}
     * @private
     */
    function _makePrevButton() {
        var prevButtonView = document.createElement('div');
        prevButtonView.className = CSS_CLASS_NAMES.PREV;
        return entity(prevButtonView, {})
            .on('select', _handlePrevSelectEvent);
    }

    function _handlePrevSelectEvent() {
        that.fireEvent('prev');
    }

    /**
     * Creates a new entity representing the next button and appends it to view.
     * Subscribes to its 'select' event which triggers that's 'next' event
     * @return {*}
     * @private
     */
    function _makeNextButton() {
        var nextButtonView = document.createElement('div');
        nextButtonView.className = CSS_CLASS_NAMES.NEXT;
        return entity(nextButtonView, {})
            .on('select', _handleNextSelectEvent);
    }

    function _handleNextSelectEvent() {
        that.fireEvent('next');
    }

    return that;
};

var blank = function (view, spec) {

    var CSS_CLASS_NAMES = {
        NORMAL:       'blank',
        FOCUSED:      'focused',
        CORRECT:      'correct',
        MISTAKE:      'mistake',
        HINT:         'hint',
        STAR:         'star',
        CHILD_ANSWER: 'answer',
        CHILD_POINTS: 'points'
    };

    var that = entity(view, spec),
        solution = {
            isCorrect: false,
            score:     100,
            answers:   []
        },
        baseRemove = that.remove;

    var _solved = false,
        _focused = false,
        _starLost = false,
        _parentQuestion = spec['parentQuestion'],
        _star = null,
        _points = null,
        _choiceMatrix = [],
        _index = spec['index'],
        _multiChoicer = null,
        _solution = [],
        _tokenChoiceMap = [],
        _choiceCol;

    /**
     * Init
     */
    (function init() {

        view.className = CSS_CLASS_NAMES.NORMAL;

        that.on('select', function () {

        });

        /*  create points view element with default amount of 100  */
        _points = _makePoints(100);

        /*  create star entity and append to view */
        _star = _makeStar().appendTo(that);

        //  for each answer in blank
        for (var answerIndex = 0; answerIndex < spec['answers'].length; answerIndex++) {
            //  note that answers should carry the number of blank they belong to

            //  prepare data object associated with answer and create DOM element
            var data = {
                index:      answerIndex,
                blankIndex: _index,
                token:      spec['answers'][answerIndex]['token'],
                isCorrect:  spec['answers'][answerIndex]['correct'],
                feedback:   spec['answers'][answerIndex]['feedback'],
                blank:      this
            };
            _choiceMatrix.push(_makeChoices(data));
        }
        _tokenChoiceMap = _createTokenChoiceMap(_choiceMatrix);
        _choiceCol = 0;
        _updateChoices(_choiceCol);
    })();

    that.removeInnerEntitiesAfterSolved = function () {
        _star.remove();
        _points.remove();
        return this;
    };

    /**
     * Puts the supplied token in the blank, and toggles the state of the blank based on an answer matching the token.
     * If the supplied token matches a CORRECT answer to this blank
     *      isSolved is set to true, the state of the blank is toggled to solved.
     * Else then isSolved is set to false, the state of the blank is toggled unsolved
     *      If the matching answer in case of a mistake contains a hint, the hasHint flag is set true.
     *
     * In any case, isSubmitted is set to true.
     *
     * @param {answer} choice an answer object
     * @return {boolean} iSolved true if supplied token matches a correct answer, false otherwise.
     *
     */
    that.submitAnswer = function (choice) {
        if (__solved) {
            return __solved;
        }

        // Get wordIndex
        var wordIndex = choice.getWordIndex(),
            index = choice.getIndex(),
            correct = choice.isCorrect();

        if (correct) {
            // If answer is the missing piece we expect,
            // append it to the solution.
            choice.hide()
                .appendTo(this);
            _solution.push(choice);

            _choiceCol++;
        }

        if (choice.isLast()) {
            if (correct) {
                __solved = true;
                _onCorrectSubmission();
            }
            else {
                _onFalseSubmission();
            }
        }

        _updateChoices(_choiceCol);

        return correct;
    };

    that.getSubmittedAnswer = function () {
        return _solution[_choiceCol];
    };

    /**
     * Returns the star object if it is not lost, null otherwise.
     */
    that.getStar = function () {
        return _starLost ? null : _star;
    };

    /**
     * Displays the blank as focused and presents the multichoices contained.
     * If a hint was showing when blank left focus, it is shown again.
     * @return {*}
     */
    that.focus = function () {
        if (!_focused) {
            view.classList.add(CSS_CLASS_NAMES.FOCUSED);
            _focused = true;
        }
        return this;
    };

    /**
     * Displays the blank as unfocused, hides multichoices and any hint that is showing.
     * @return {*}
     */
    that.unFocus = function () {
        if (_focused) {
            view.classList.remove(CSS_CLASS_NAMES.FOCUSED);
            _focused = false;
        }

        return this;
    };

    that.getMultiChoiceManager = function () {
        return _multiChoicer;
    };

    that.setMultiChoiceManager = function (manager) {
        _multiChoicer = manager;
    };

    that.isSolved = function () {
        return _solved;
    };

    that.getIndex = function () {
        return _index;
    };

    that.getAnswers = function () {
        var choices = [];

        for (var prop in _tokenChoiceMap) {
            if (_tokenChoiceMap.hasOwnProperty(prop)) {
                choices.push(_tokenChoiceMap[prop]);
            }
        }
        return choices;
    };

    that.getPoints = function () {
        return _points.getData()['value'];
    };

    that.setPoints = function (amount) {
        _points.getData()['value'] = amount;
        _points.setInnerText(amount);
        return this;
    };

    function _createTokenChoiceMap(choiceMatrix) {
        var tokenChoiceMap = {};
        for (var i=0 ;i <choiceMatrix.length; i++) {
            for (var j=0; j<choiceMatrix[i].length; j++) {
                var token = choiceMatrix[i][j].getToken();
                if (!tokenChoiceMap.hasOwnProperty(token)) {
                    tokenChoiceMap[token] = answer(document.createElement('div'), {
                        token: token
                    });
                }
            }
        }
        return tokenChoiceMap;
    }

    function _updateChoices(choiceIndex) {
        // reset choices
        for (var prop in _tokenChoiceMap) {
            _tokenChoiceMap[prop].setIsCorrect(false);
            _tokenChoiceMap[prop].setIsLast(false);
        }
        // update only correct choices at choiceIndex
        for (var i=0; i< _choiceMatrix.length; i++) {
            var choices = _choiceMatrix[i];
            if (choiceIndex < choices.length) {
                if (choices[choiceIndex].isCorrect()) {
                    _tokenChoiceMap[choices[choiceIndex].getToken()].setIsCorrect(true);
                }
                if (choiceIndex === choices.length - 1) {
                    _tokenChoiceMap[choices[choiceIndex].getToken()].setIsLast(true);
                }
            }
        }
    }

    function _onCorrectSubmission() {
        _toNormalState();

        //  if the star was lost upon a false submission - do not show it again
        if (_starLost) {
            _star.hide();
        } else {
        }

        //  the star is collected but is still drawn on screen.
        //  disable any select events.
        _star.disableSelectEvents();

        view.classList.add(CSS_CLASS_NAMES.CORRECT);
        _solution.map(function(choice) {
            choice.show();
        });
        _points.appendTo(that);
    }

    function _onFalseSubmission() {
        _toNormalState();

        view.classList.add(CSS_CLASS_NAMES.MISTAKE);
        _solution.show();

        //  once a star is lost it is still drawn on screen. disable select events of that star
        if (!_starLost) {
            _star.disableSelectEvents();
            _starLost = true;
        }

    }

    function _toNormalState() {

        view.className = CSS_CLASS_NAMES.NORMAL;

        if (_focused) {
            view.classList.add(CSS_CLASS_NAMES.FOCUSED);
        }
    }

    function _makeChoices(spec) {

        // parse answer token to words
        // create an answer per each word with identical spec
        // add property to spec with index of word in token

        var answers = [],
            words = spec.token.split(' ');
        logIt(words);

        for (var i = 0; i < words.length; i++) {
            var view = document.createElement('span');
            view.className = CSS_CLASS_NAMES.CHILD_ANSWER;
            var data = {
                tokenIndex: i,
                index:      spec.index,
                blankIndex: spec.blankIndex,
                token:      words[i],
                isCorrect:  spec.isCorrect,
                feedback:   spec.feedback,
                blank:      this,
                isLast:     i === words.length - 1 ? true : false
            };
            var ans = answer(view, data)
                .on('select', _handleInnerEntitySelectEvent);
            answers.push(ans);
        }

        return answers;
    }

    function _makePoints(amount) {
        var pointsView = document.createElement('span');
        pointsView.className = CSS_CLASS_NAMES.CHILD_POINTS;
        return entity(pointsView, {'value': amount})
            .setInnerText(amount)
    }

    function _makeStar() {
        var starView = document.createElement('span');
        starView.className = CSS_CLASS_NAMES.STAR;
        return entity(starView, {})
            .on('select', _handleInnerEntitySelectEvent)
    }

    /**
     * Captures inner entities select events and publishes them as a blank select event.
     * Entities included are points, answer, and star.
     * In case of a star, once it has been collected or lost, it is no longer valid for a select event.
     * @private
     */
    function _handleInnerEntitySelectEvent() {

        that.fireEvent('select');
    }

    return that;
};

var constructorBlank = function (view, spec) {

    var CSS_CLASS_NAMES = {
        NORMAL:       'blank',
        FOCUSED:      'focused',
        CORRECT:      'correct',
        MISTAKE:      'mistake',
        HINT:         'hint',
        STAR:         'star',
        CHILD_ANSWER: 'answer',
        CHILD_POINTS: 'points'
    };

    var that = blank(view, spec),
        solution = {
            isCorrect: false,
            score:     100,
            answers:   []
        },
        baseRemove = that.remove;

    var _solved = false,
        _focused = false,
        _starLost = false,
        _parentQuestion = spec['parentQuestion'],
        _star = null,
        _points = null,
        _choiceMatrix = [],
        _index = spec['index'],
        _multiChoicer = null,
        _solution = [],
        _tokenChoiceMap = [],
        _choiceCol;

    /**
     * Init
     */
    (function init() {

        view.className = CSS_CLASS_NAMES.NORMAL;

        that.on('select', function () {

        });

        /*  create points view element with default amount of 100  */
        _points = _makePoints(100);

        /*  create star entity and append to view */
        _star = _makeStar().appendTo(that);

        //  for each answer in blank
        for (var answerIndex = 0; answerIndex < spec['answers'].length; answerIndex++) {
            //  note that answers should carry the number of blank they belong to

            //  prepare data object associated with answer and create DOM element
            var data = {
                index:      answerIndex,
                blankIndex: _index,
                token:      spec['answers'][answerIndex]['token'],
                isCorrect:  spec['answers'][answerIndex]['correct'],
                feedback:   spec['answers'][answerIndex]['feedback'],
                blank:      this
            };
            _choiceMatrix.push(_makeChoices(data));
        }
        _tokenChoiceMap = _createTokenChoiceMap(_choiceMatrix);
        _choiceCol = 0;
        _updateChoices(_choiceCol);
    })();

    that.removeInnerEntitiesAfterSolved = function () {
        _star.remove();
        _points.remove();
        return this;
    };

    /**
     * Puts the supplied token in the blank, and toggles the state of the blank based on an answer matching the token.
     * If the supplied token matches a CORRECT answer to this blank
     *      isSolved is set to true, the state of the blank is toggled to solved.
     * Else then isSolved is set to false, the state of the blank is toggled unsolved
     *      If the matching answer in case of a mistake contains a hint, the hasHint flag is set true.
     *
     * In any case, isSubmitted is set to true.
     *
     * @param {answer} choice an answer object
     * @return {boolean} iSolved true if supplied token matches a correct answer, false otherwise.
     *
     */
    that.submitAnswer = function (choice) {
        if (__solved) {
            return __solved;
        }

        // Get wordIndex
        var wordIndex = choice.getWordIndex(),
            index = choice.getIndex(),
            correct = choice.isCorrect();

        if (correct) {
            // If answer is the missing piece we expect,
            // append it to the solution.
            _solution.push(choice);
            choice.hide()
                .appendTo(this);

            _choiceCol++;
        }

        if (choice.isLast()) {
            if (correct) {
                __solved = true;
                _onCorrectSubmission();
            }
            else {
                _onFalseSubmission();
            }
        }

        _updateChoices(_choiceCol);

        return __solved;
    };

    that.getSubmittedAnswer = function () {
        return _solution[_choiceCol];
    };

    /**
     * Returns the star object if it is not lost, null otherwise.
     */
    that.getStar = function () {
        return _starLost ? null : _star;
    };

    /**
     * Displays the blank as focused and presents the multichoices contained.
     * If a hint was showing when blank left focus, it is shown again.
     * @return {*}
     */
    that.focus = function () {
        if (!_focused) {
            view.classList.add(CSS_CLASS_NAMES.FOCUSED);
            _focused = true;
        }
        return this;
    };

    /**
     * Displays the blank as unfocused, hides multichoices and any hint that is showing.
     * @return {*}
     */
    that.unFocus = function () {
        if (_focused) {
            view.classList.remove(CSS_CLASS_NAMES.FOCUSED);
            _focused = false;
        }

        return this;
    };

    that.getMultiChoiceManager = function () {
        return _multiChoicer;
    };

    that.setMultiChoiceManager = function (manager) {
        _multiChoicer = manager;
    };

    that.isSolved = function () {
        return __solved;
    };

    that.getIndex = function () {
        return _index;
    };

    that.getAnswers = function () {
        var choices = [];

        for (var prop in _tokenChoiceMap) {
            if (_tokenChoiceMap.hasOwnProperty(prop)) {
                choices.push(_tokenChoiceMap[prop]);
            }
        }
        return choices;
    };

    that.getPoints = function () {
        return _points.getData()['value'];
    };

    that.setPoints = function (amount) {
        _points.getData()['value'] = amount;
        _points.setInnerText(amount);
        return this;
    };

    function _createTokenChoiceMap(choiceMatrix) {
        var tokenChoiceMap = {};
        for (var i=0 ;i <choiceMatrix.length; i++) {
            for (var j=0; j<choiceMatrix[i].length; j++) {
                var token = choiceMatrix[i][j].getToken();
                if (!tokenChoiceMap.hasOwnProperty(token)) {
                    tokenChoiceMap[token] = answer(document.createElement('div'), {
                        token: token
                    });
                }
            }
        }
        return tokenChoiceMap;
    }

    function _updateChoices(choiceIndex) {
        // reset choices
        for (var prop in _tokenChoiceMap) {
            _tokenChoiceMap[prop].setIsCorrect(false);
            _tokenChoiceMap[prop].setIsLast(false);
        }
        // update only correct choices at choiceIndex
        for (var i=0; i< _choiceMatrix.length; i++) {
            var choices = _choiceMatrix[i];
            if (choiceIndex < choices.length) {
                if (choices[choiceIndex].isCorrect()) {
                    _tokenChoiceMap[choices[choiceIndex].getToken()].setIsCorrect(true);
                }
                if (choiceIndex === choices.length - 1) {
                    _tokenChoiceMap[choices[choiceIndex].getToken()].setIsLast(true);
                }
            }
        }
    }

    function _onCorrectSubmission() {
        _toNormalState();

        //  if the star was lost upon a false submission - do not show it again
        if (_starLost) {
            _star.hide();
        } else {
        }

        //  the star is collected but is still drawn on screen.
        //  disable any select events.
        _star.disableSelectEvents();

        view.classList.add(CSS_CLASS_NAMES.CORRECT);
        _solution.map(function(choice) {
            choice.show();
        });
        _points.appendTo(that);
    }

    function _onFalseSubmission() {
        _toNormalState();

        view.classList.add(CSS_CLASS_NAMES.MISTAKE);
        _solution.show();

        //  once a star is lost it is still drawn on screen. disable select events of that star
        if (!_starLost) {
            _star.disableSelectEvents();
            _starLost = true;
        }

    }

    function _toNormalState() {

        view.className = CSS_CLASS_NAMES.NORMAL;

        if (_focused) {
            view.classList.add(CSS_CLASS_NAMES.FOCUSED);
        }
    }

    function _makeChoices(spec) {

        // parse answer token to words
        // create an answer per each word with identical spec
        // add property to spec with index of word in token

        var answers = [],
            words = spec.token.split(' ');
        logIt(words);

        for (var i = 0; i < words.length; i++) {
            var view = document.createElement('span');
            view.className = CSS_CLASS_NAMES.CHILD_ANSWER;
            var data = {
                tokenIndex: i,
                index:      spec.index,
                blankIndex: spec.blankIndex,
                token:      words[i],
                isCorrect:  spec.isCorrect,
                feedback:   spec.feedback,
                blank:      this,
                isLast:     i === words.length - 1 ? true : false
            };
            var ans = answer(view, data)
                .on('select', _handleInnerEntitySelectEvent);
            answers.push(ans);
        }

        return answers;
    }

    function _makePoints(amount) {
        var pointsView = document.createElement('span');
        pointsView.className = CSS_CLASS_NAMES.CHILD_POINTS;
        return entity(pointsView, {'value': amount})
            .setInnerText(amount)
    }

    function _makeStar() {
        var starView = document.createElement('span');
        starView.className = CSS_CLASS_NAMES.STAR;
        return entity(starView, {})
            .on('select', _handleInnerEntitySelectEvent)
    }

    /**
     * Captures inner entities select events and publishes them as a blank select event.
     * Entities included are points, answer, and star.
     * In case of a star, once it has been collected or lost, it is no longer valid for a select event.
     * @private
     */
    function _handleInnerEntitySelectEvent() {

        that.fireEvent('select');
    }

    return that;
};

var feedback = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF: 'feedback'
    };

    var that = entity(view),
        child;

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;
    }());

    that.put = function (token) {
        _clear();
        child = document.createElement('span');
        child.innerHTML = token;
        view.appendChild(child);
    };

    that.clear = function () {
        _clear();
    };

    function _clear() {
        while (view.lastChild) {
            view.removeChild(view.lastChild);
        }
    }

    return that;
};

var answer = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF: 'answer',
        HINT: 'hint'
    };

    var that = entity(view, spec),
        baseRemove = that.remove;

    var _token =  spec.hasOwnProperty('token') ? spec['token'] : "",
        _isCorrect = spec.hasOwnProperty('isCorrect') ? spec['isCorrect'] : false,
        _hint,
        _index = spec.hasOwnProperty('index') ? spec['index'] : -1,
        _wordIndex = spec.hasOwnProperty('tokenIndex') ? spec['tokenIndex'] : -1,
        _blankIndex = spec.hasOwnProperty('blankIndex') ? spec['blankIndex'] : -1,
        _isLast = spec.hasOwnProperty('isLast') ? spec['isLast'] : false;

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;
        view.innerHTML = _token;

        _hint = _makeHint((typeof spec['feedback'] === 'string') ? spec['feedback'] : "");
    }());

    that.remove = function () {
        return baseRemove.apply(that);
    };

    that.getIndex = function () {
        return _index;
    };

    that.getHint = function () {
        return _hint;
    };

    that.getToken = function () {
        return _token;
    };

    that.isCorrect = function () {
        return _isCorrect;
    };

    that.setIsCorrect = function(val) {
        _isCorrect = val;
        return this;
    };

    that.getBlankIndex = function () {
        return _blankIndex;
    };

    that.getWordIndex = function () {
        return _wordIndex;
    };

    that.isLast = function () {
        return _isLast;
    };

    that.setIsLast = function(val) {
        _isLast = val;
        return this;
    };

    function _makeHint(text) {
        var hintView = document.createElement('span');
        hintView.className = CSS_CLASS_NAMES.HINT;
        //        hintView.innerHTML = text;
        return hint(hintView, {'text': text});
    }

    return that;
};

var hint = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF:  'hint',
        CHILD: 'hint-elem'
    };

    var that = entity(view, spec),
        baseRemove = that.remove,
        baseAppendTo = that.appendTo;

    var words;

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;
        words = _createWordElements(spec['text']);
    }());

    that.remove = function () {
        while (view.lastChild) {
            view.removeChild(view.lastChild);
        }
        return baseRemove.apply(this);
    };

    that.appendTo = function (parent) {
        baseAppendTo.apply(this, [parent]);
        for (var i = 0; i < words.length; i++) {
            _appendChildWithDelay(words[i], (i + 1) * 80);
        }
    };

    function _createAndAppendChild(txt) {
        var childView = document.createElement('span');
        childView.innerHTML = txt;
        view.appendChild(childView);
        return entity(childView, {}).hide();
    }

    function _createWordElements(txt) {

        var words = txt.split("");
        var elems = [];
        var index = 0;

        while (index < words.length) {
            var wordElem = document.createElement('span');
            var innerHtml = "";
            if (words[index] === " ") {
                innerHtml = "&nbsp";
                index++;
            }
            innerHtml += words[index];
            wordElem.innerHTML = innerHtml;
            wordElem.className = CSS_CLASS_NAMES.CHILD;
            elems.push(wordElem);
            index++;
        }
        //        for (var i = 0; i < words.length; i++) {
        //            var wordElem = document.createElement('span');
        //            if( words[i] === " "){
        //                words[i] = "&nbsp" + words[i+1];
        //            }
        //            wordElem.innerHTML = words[i];
        //            wordElem.className = CSS_CLASS_NAMES.CHILD;
        //            logIt('word in hint: ' + words[i]);
        //            elems.push(wordElem);
        //        }
        return elems;
    }

    function _appendChildWithDelay(child, delay) {
        setTimeout(function () {
            view.appendChild(child);
        }, delay);
    }

    return that;
};

var progressBar = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF:  'progressBar',
        INNER: 'progressBar-inner'
    };

    var that = entity(view);

    var child,
        value = (spec['value'] < 0) ? 0 : spec['value'] > 100 ? 100 : spec['value'];

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;

        child = document.createElement('div');
        child.style.width = value + '%';
        child.className = CSS_CLASS_NAMES.INNER;
        view.appendChild(child);
    }());

    that.increment = function (units) {
        value += units;
        if (value > 100) {
            value = 100;
        }
        _setChildWidth();
    };

    that.decrement = function (units) {
        value -= units;
        if (value < 0) {
            value = 0;
        }

        _setChildWidth();
    };

    that.getValue = function () {
        return value;
    };

    function _setChildWidth() {
        child.style.width = value + '%';
    }

    return that;
};

var list = function (view, spec) {

    var CSS_CLASS_NAMES = {
        SELF: 'list',
        ITEM: 'list-item'
    };

    var that = entity(view);

    var items = spec['items'],
        itemViewElements = [];

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;

        /*  create list items and attach event handlers on select   */
        for (var i = 0; i < items.length; i++) {
            var itemView = document.createElement('li');
            itemView.className = CSS_CLASS_NAMES.ITEM;
            itemView.innerHTML = items[i];
            itemView.addEventListener('click', _handleItemSelectEvent);
        }
    }());

    that.setText = function (hintText) {
        text = hintText;
        view.innerHTML = text;
        return this;
    };

    function _handleItemSelectEvent(item) {

    }

    return that;
};

/**
 * Parses the text supplied at instantiation by the supplied delimiter.
 *
 * @param view
 * @param spec
 * @return {*}
 */
var segmenter = function (view, spec) {
    var CSS_CLASS_NAMES = {
        SELF:    'segmenter',
        SEGMENT: 'segmenter-segment'
    };

    var that = entity(view, spec),
        baseRemove = that.remove,
        baseAppendTo = that.appendTo;

    var _segments = [],
        _rawText = spec['text'] || '',
        _delimiter = spec['delimiter'] || '';

    (function init() {
        view.className = CSS_CLASS_NAMES.SELF;
        _segments = _segmentize(spec['text']);
    }());

    that.remove = function () {
        while (view.lastChild) {
            view.removeChild(view.lastChild);
        }
        return baseRemove.apply(this);
    };

    that.appendTo = function (parent) {
        baseAppendTo.apply(this, [parent]);
        for (var i = 0; i < _segments.length; i++) {
            _appendChildWithDelay(_segments[i], (i + 1) * 80);
        }
    };

    function _createAndAppendChild(txt) {
        var childView = document.createElement('span');
        childView.innerHTML = txt;
        view.appendChild(childView);
        return entity(childView, {}).hide();
    }

    function _segmentize(txt) {

        var rawSegments = txt.split(_delimiter);
        var elems = [];
        var index = 0;

        while (index < rawSegments.length) {
            var innerHtml = "";
            if (rawSegments[index] === " ") {
                innerHtml = "&nbsp";
                index++;
            }
            innerHtml += rawSegments[index];
            var element = document.createElement('span');
            element.innerHTML = innerHtml;
            element.className = CSS_CLASS_NAMES.CHILD;
            elems.push(element);
            index++;
        }
        return elems;
    }

    function _appendChildWithDelay(child, delay) {
        setTimeout(function () {
            view.appendChild(child);
        }, delay);
    }

    return that;
};



/**
 * User: guyman
 * Date: 4/26/14
 * Time: 8:16 PM
 */

function Blank(visual, spec) {
    Entity.call(this, visual, spec);

    this.__solution = {
        isCorrect: false,
            score:     100,
        answers:   []
    };
    this.__solved = false;
    this.__focused = false;
    this.__starLost = false;
    this.__star = null;
    this.__points = null;
    this.__choiceMatrix = [];
    this.__index = spec['index'];
    this.__multiChoicer = null;
    this.__tokenChoiceMap = [];
    this.__solLength = 0;
    var that = entity(visual, spec),
        solution = {
            isCorrect: false,
            score:     100,
            answers:   []
        },
        baseRemove = that.remove;

    var _parentQuestion = spec['parentQuestion'],
        _choiceMatrix = [],
        index = spec['index'],
        multiChoicer = null,
        _tokenChoiceMap = [],
        _choiceCol;

    /**
     * Init
     */
    (function init() {

        this.visual.class = this.__styleClasses.NORMAL;

        /*  create points view element with default amount of 100  */
        this.points = this.__makeScore(100);

        /*  create star entity and append to view */
        this.star = this.visual.append(this.__makeStar());

        //  for each answer in blank
        for (var i = 0; i < spec['answers'].length; i++) {
            //  note that answers should carry the number of blank they belong to

            //  prepare data object associated with answer and create DOM element
            var data = {
                index:      i,
                blankIndex: this.index,
                token:      spec['answers'][i]['token'],
                isCorrect:  spec['answers'][i]['correct'],
                feedback:   spec['answers'][i]['feedback'],
                blank:      this
            };
            this.__choiceMatrix.push(this.__makeChoices(data));
        }
        this.__tokenChoiceMap = this.__createTokenChoiceMap(_choiceMatrix);
        this.__solLength = 0;
        this.__updateChoices(_choiceCol);
    })();
}

Blank.prototype = Object.create(Entity.prototype);
Blank.prototype.constructor = Blank;
Blank.prototype.define('__visualClasses', {
    writable: false,
    value: {
        NORMAL:       'blank',
        FOCUSED:      'focused',
        CORRECT:      'correct',
        MISTAKE:      'mistake',
        HINT:         'hint',
        STAR:         'star',
        CHILD_ANSWER: 'answer',
        CHILD_POINTS: 'points'
    }
});
Blank.prototype.define('__ePoints', null);
Blank.prototype.define('__eStar', null);
Blank.prototype.define('isFocused', {
    value: false,
    set: function(focus) {
        if (focus && !this.isFocused) {
            this.visual.decorate(this.__styleClasses.FOCUSED);
            this.focused = true;
        } else if (!focus && this.isFocused) {
            this.visual.strip(this.__styleClasses.FOCUSED);
            this.focused = false;
        }
    }
});
Blank.prototype.define('isSolved', false);
Blank.prototype.define('isStarLost', false);
Blank.prototype.define('star', null);
Blank.prototype.define('points', null);
Blank.prototype.define('index', -1);
Blank.prototype.define('solution', []);
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
Blank.prototype.submitAnswer = function (choice) {
    if (this.__solved) {
        return this.__solved;
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
        this.solution.push(choice);

        this.__solLength++;
    }

    if (choice.isLast()) {
        if (correct) {
            this.solved = true;
            this.__onCorrectSubmission();
        }
        else {
            this.__onFalseSubmission();
        }
    }

    this.__updateChoices(this.__solLength);

    return correct;
};
Blank.prototype.removeInnerEntitiesAfterSolved = function () {
    this.star.remove();
    this.points.remove();
    return this;
};

Blank.prototype.getAnswers = function () {
    var choices = [];

    for (var prop in this.__tokenChoiceMap) {
        if (this.__tokenChoiceMap.hasOwnProperty(prop)) {
            choices.push(this.__tokenChoiceMap[prop]);
        }
    }
    return choices;
};

Blank.prototype.getPoints = function () {
    return points.value;
};

Blank.prototype.setPoints = function (amount) {
    points.getData()['value'] = amount;
    points.setInnerText(amount);
    return this;
};

Blank.prototype.__createTokenChoiceMap = function(choiceMatrix) {
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
};

Blank.prototype.__updateChoices = function(atIndex) {
    // reset choices
    for (var prop in this.__tokenChoiceMap) {
        this.__tokenChoiceMap[prop].setIsCorrect(false);
        this.__tokenChoiceMap[prop].setIsLast(false);
    }
    // update only correct choices at choiceIndex
    for (var i=0; i< this.__choiceMatrix.length; i++) {
        var choices = this.__choiceMatrix[i];
        if (atIndex < choices.length) {
            if (choices[atIndex].isCorrect()) {
                this.__tokenChoiceMap[choices[atIndex].getToken()].setIsCorrect(true);
            }
            if (atIndex === choices.length - 1) {
                this.__tokenChoiceMap[choices[atIndex].getToken()].setIsLast(true);
            }
        }
    }
};

Blank.prototype.__onCorrectSubmission = function() {
    this.__toNormalState();

    //  if the star was lost upon a false submission - do not show it again
    if (starLost) {
        star.hide();
    } else {
    }

    //  the star is collected but is still drawn on screen.
    //  disable any select events.
    star.disableSelectEvents();

    this.visual.addClass(this.__visualClasses.CORRECT);
    solution.map(function(choice) {
        choice.show();
    });
    points.appendTo(that);
};

Blank.prototype.__onFalseSubmission = function()  {
    this.__toNormalState();

    visual.classList.add(this.__visualClasses.MISTAKE);
    solution.show();

    //  once a star is lost it is still drawn on screen. disable select events of that star
    if (!this.starLost) {
        star.disableSelectEvents();
        this.starLost = true;
    }

};

Blank.prototype.__toNormalState = function() {

    this.visual.class = this.__visualClasses.NORMAL;

    if (this.isFocused) {
        this.visual.addClass(this.__visualClasses.FOCUSED);
    }
};

Blank.prototype.__makeChoices = function(spec) {

    // parse answer token to words
    // create an answer per each word with identical spec
    // add property to spec with index of word in token

    var answers = [],
        words = spec.token.split(' ');
    logIt(words);

    for (var i = 0; i < words.length; i++) {
        var view = document.createElement('span');
        view.className = __css_classes.CHILD_ANSWER;
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
            .on('select', this.__handleInnerEntitySelectEvent);
        answers.push(ans);
    }

    return answers;
};

Blank.prototype.__makeScore = function(amount) {
    var ntt = new Visual('span');
    ntt.text = amount;
    ntt.class = this.__visualClasses.CHILD_POINTS;
    return ntt;
};

Blank.prototype.__makeStar = function() {
    var visual = new Visual('span');
    visual.class = this.__styleClasses.STAR;
    visual.on('select', this.__handleInnerEntitySelectEvent);
    return visual;
};
Blank.prototype.__showChoices = function() {
    for (var i=0; i<this.choices.length; i++) {
        this.choices[i].visual.show();
    }
};
Blank.prototype.__hideChoices = function() {
    this.choices.map(function(choice) {
        choice.visual.hide()
    });
};

/**
 * Captures inner entities select events and publishes them as a blank select event.
 * Entities included are points, answer, and star.
 * In case of a star, once it has been collected or lost, it is no longer valid for a select event.
 * @private
 */
Blank.prototype.__handleInnerEntitySelectEvent = function() {
    this.fireEvent('select');
};

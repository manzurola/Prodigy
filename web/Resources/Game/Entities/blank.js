/**
 * User: guyman
 * Date: 4/26/14
 * Time: 8:16 PM
 */

function Blank(visual, spec) {
    Entity.call(this, visual);

    this.index = spec.index;
    this.class = this.__styleClasses.NORMAL;
    /*  create points view element with default amount of 100  */
    this.score = new Entity('span');
    this.score.text = '100';
    this.score.class = this.__styleClasses.CHILD_POINTS;
    this.append(this.score);
    /*  create star entity and append to view */
    this.star = new Entity('span');
    this.star.class = this.__styleClasses.STAR;
    this.star.on('select', this.__handleInnerEntitySelectEvent);
    this.append(this.star);

    this.__choiceMatrix = this.__createChoiceMatrix(spec['answers']);
    this.__tokenChoiceMap = this.__createTokenChoiceMap(this.__choiceMatrix);
    this.__updateChoices(this.answer.children.length);
    this.answer = new Entity('span');
    this.append(this.answer);
}

Blank.prototype = Object.create(Entity.prototype);
Blank.prototype.constructor = Blank;
Blank.prototype.define('__styleClasses', {
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
Blank.prototype.__createChoiceMatrix = function(ansArr) {
    //  for each answer in blank
    for (var i = 0; i < ansArr.length; i++) {
        //  note that answers should carry the number of blank they belong to

        //  prepare data object associated with answer and create DOM element
        var data = {
            index:      i,
            blankIndex: this.index,
            token:      ansArr[i]['token'],
            isCorrect:  ansArr[i]['correct'],
            feedback:   ansArr[i]['feedback'],
            blank:      this
        };
        this.__choiceMatrix.push(this.__makeChoices(data));
    }
};
Blank.prototype.define('isFocused', false);
Blank.prototype.define('isSolved', false);
Blank.prototype.define('isStarLost', false);
Blank.prototype.define('star', null);
Blank.prototype.define('points', null);
Blank.prototype.define('answer', null);
Blank.prototype.define('index', -1);
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
        this.answer.push(choice);

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
Blank.prototype.
Blank.prototype.focus = function() {
        if (!this.isFocused) {
            this.addClass(this.__styleClasses.FOCUSED);
        }
    this.isFocused = true;
};
Blank.prototype.unfocus = function() {
     if (this.isFocused) {
        this.removeClass(this.__styleClasses.FOCUSED);
    }
    this.isFocused = false;
};
Blank.prototype.removeInnerEntitiesAfterSolved = function () {
    this.star.remove();
    this.score.remove();
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
    if (this.isStarLost) {
        this.star.hide();
    }

    //  the star is collected but is still drawn on screen.
    //  disable any select events.
    this.star.disableSelectEvents();

    this.addClass(this.__visualClasses.CORRECT);
    this.answer.show();
    this.append(points);
};

Blank.prototype.__onFalseSubmission = function()  {
    this.__toNormalState();

    this.addClass(this.__styleClasses.MISTAKE);
    this.answer.show();

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
        var elem = document.createElement('span');
        elem.className = this.__styleClasses.CHILD_ANSWER;
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
        var ans = answer(elem, data)
            .on('select', this.__handleInnerEntitySelectEvent);
        answers.push(ans);
    }

    return answers;
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

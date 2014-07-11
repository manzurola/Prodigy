/**
 * User: guyman
 * Date: 12/13/13
 * Time: 1:19 AM
 *
 * TODO: rename to absorber ? (rename blank to VOID?)
 */
function TheBlankFiller(elem, spec) {
    Challenge.call(this, elem, spec);
    this.__sentence = null;
    this.__choiceBox = null;
    this.__choices = {};
    this.__blanks = [];
    this.__blanksComplete = [];
    this.__blanksIncomplete = [];
    this.blank = 0;

    function createBlank(element, solutions, dummies) {
        return new Visual({
            element: element
        }).data({
                answers: solutions,
                dummies: dummies
            })
            .decorate('empty');
    }

    function createChoice(token) {
        return new Choice({
            element: document.createElement('div')
        }).text(token)
            .decorate('selected')
            .on('click', onclick);
    }

    function parseAnswers(elem) {
        return elem.innerText.split(',');
    }

    function initBlanks() {
        var rawBlanks = this.__sentence.element().getElementsByClassName('blank'),
            dummies = spec.dummies.split(','),
            numOfBlanks = rawBlanks.length;

        for (var i = 0; i < numOfBlanks; i++) {
            var elem = rawBlanks[i];                                //  Dom element with answers as inner text
            var answers = parseAnswers(elem);                 //  Array of correct answers
            var blank = createBlank(elem, answers, dummies)
                .id(i)
                .text('');                                          //  Clear answers from initial state

            this.__blanks.push(blank);
            this.__unsolvedBlanks.push(numOfBlanks - (i + 1));      //  reverse order push
        }
    }

    function initChoices() {
        var uniqueTokens = {};
        for (var i = 0; i < this.__blanks.length; i++) {
            var blank = this.__blanks[i],
                answers = blank.data('answers'),
                dummies = blank.data('dummies');
            for (var j = 0; j < answers.length; j++) {
                uniqueTokens[answers[j]] = true;
            }
            for (var k = 0; k < dummies.length; k++) {
                uniqueTokens[dummies[k]] = true;
            }
        }
        for (var count = 0; count < uniqueTokens.length; count++) {
            var choice = createChoice(uniqueTokens.pop())
                .id(count);
            this.__choices[count] = choice;
            this.__choiceBox.append(choice);
        }
    }

    function initSentence() {
        this.__sentence = new Visual({
            element: document.createElement('div')
        }).html(spec.sentence)
            .decorate('sentence');
    }

    (function init(_this) {
        initSentence();
        initBlanks();
        initChoices();
        _this.append(_this.__sentence)
            .append(_this.__choiceBox);
        _this.focusBlank(0);
    }(this));
}
TheBlankFiller.prototype = Object.create(Challenge.prototype);
TheBlankFiller.prototype.constructor = TheBlankFiller;
TheBlankFiller.prototype.update = function (choice) {
    var blank = this.__blanks[this.__focusedBlank];

    if (!this.__unsolvedBlanks.contains(blank)) {
        // Blank was already solved
        this.isIdle(true);
        return this;
    }

    this.hitpoints(1 / this.__blanks.length);
    blank.empty();
    if (blank.data('answers').contains(choice.token)) {
        //  Solve blank
        blank.append(new Visual(document.createElement('span')), {})
            .text(choice.token)
            .decorate('correct');
        this.isCorrect(true)
            .isMistake(false);
        this.__unsolvedBlanks.remove(blank);
        this.__solvedBlanks.push(blank);
        if (this.__unsolvedBlanks.length === 0) {
            this.isSolved(true);
        }
    } else {
        //  Mistake
        blank.decorate('mistake');
        this.isCorrect(false)
            .isMistake(true)
            .isSolved(false);
    }

//    this.evaluate(blank, choice);
//    if (this.__isDead) {
//        return this;
//    }
//    if (this.__isHurt) {
//        this.decorateCorrect(blank, choice);
//        if (this.__isDead) {
//
//        } else {
//            var nextBlank = this.__unsolvedBlanks.pop();
//            this.focusBlank(nextBlank);
//        }
//    } else if (this.__isAttacking) {
//        //  Mistake
//        this.styleMistake(blank, choice);
//    }
    this.fire('update');
    return this;
};
TheBlankFiller.prototype.styleCorrect = function (blank, choice) {
    blank.empty();
    blank.append(new Visual(document.createElement('span')), {})
        .text(choice.token)
        .decorate('correct');
    this.__sentence.decorate('correct');
    this.decorate('correct');
    return this;
};
TheBlankFiller.prototype.styleMistake = function (blank, choice) {
    blank.decorate('mistake');
    this.__sentence.decorate('mistake');
    this.decorate('mistake');
    return this;
};
//TheBlankFiller.prototype.evaluate = function (blank, choice) {
//    if (!this.__unsolvedBlanks.contains(blank)) {
//        // Blank was already solved
//        return this;
//    }
//
//    if (blank.data('answers').contains(choice.token)) {
//        //  Solve blank
//        this.isHurt(true)
//            .isAttacking(false)
//            .attackPoints(1 / this.__blanks.length);
//        this.__unsolvedBlanks.remove(blank);
//        this.__solvedBlanks.push(blank);
//        if (this.__unsolvedBlanks.length === 0) {
//            this.isDead(true);
//        }
//    } else {
//        //  Mistake
//        this.isHurt(false)
//            .isAttacking(true)
//            .attackPoints(1 / this.__blanks.length)
//            .isDead(false);
//    }
//
//    return this;
//};
TheBlankFiller.prototype.setBlank = function (nextBlank) {
    if (nextBlank >= 0 && nextBlank < this.__blanks.length) {
        this.__blanks[this.__focusedBlank]
            .strip('focused');
        this
        this.blank = this.__blanks[nextBlank]
            .decorate('focused');
    }

    return this;
};